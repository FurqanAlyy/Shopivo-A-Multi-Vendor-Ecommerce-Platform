const Stripe = require('../config/stripe')
const Order = require('../models/Order')
const Payment = require('../models/Payment')

const createCheckoutSession = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyer: req.user._id
    })

    if (!order) {
      const error = new Error('Order not found')
      error.statusCode = 404
      return next(error)
    }

    if (order.paymentMethod !== 'stripe') {
      const error = new Error(
        'This order does not use Stripe payment'
      )
      error.statusCode = 400
      return next(error)
    }

    if (order.paymentStatus === 'paid') {
      const error = new Error('Order is already paid')
      error.statusCode = 400
      return next(error)
    }

    let payment = await Payment.findOne({
      order: order._id
    })

    if (payment?.status === 'paid') {
      const error = new Error('Order is already paid')
      error.statusCode = 400
      return next(error)
    }

    const session = await Stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: ['card'],

      line_items: order.sellerOrders.flatMap(
        sellerOrder =>
          sellerOrder.items.map(item => ({
            price_data: {
              currency: 'usd',

              product_data: {
                name: item.name,
                images: item.image
                  ? [item.image]
                  : undefined
              },

              unit_amount: Math.round(
                item.unitPrice * 100
              )
            },

            quantity: item.quantity
          }))
      ),

      metadata: {
        orderId: order._id.toString(),
        buyerId: req.user._id.toString()
      },

      success_url:
        `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.CLIENT_URL}/payment/cancel`
    })

    if (!payment) {
      payment = await Payment.create({
        order: order._id,
        buyer: req.user._id,
        amount: order.total,
        currency: 'usd',
        method: 'stripe',
        status: 'pending',
        stripeSessionId: session.id
      })
    } else {
      payment.stripeSessionId = session.id
      payment.status = 'pending'

      await payment.save()
    }

    order.stripeSessionId = session.id

    await order.save()

    res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    })
  } catch (error) {
    next(error)
  }
}

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature']

  let event

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Stripe webhook signature verification failed')

    return res.status(400).json({
      success: false,
      message: 'Invalid Stripe webhook signature'
    })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        const orderId = session.metadata?.orderId

        if (!orderId) {
          return res.status(400).json({
            success: false,
            message: 'Order ID missing from Stripe session'
          })
        }

        const order = await Order.findById(orderId)

        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          })
        }

        const payment = await Payment.findOne({
          order: order._id
        })

        if (!payment) {
          return res.status(404).json({
            success: false,
            message: 'Payment record not found'
          })
        }

        if (payment.status === 'paid') {
          return res.status(200).json({
            received: true
          })
        }

        payment.status = 'paid'
        payment.stripeSessionId = session.id
        payment.stripePaymentIntentId =
          session.payment_intent
        payment.paidAt = new Date()

        await payment.save()

        order.paymentStatus = 'paid'
        order.stripeSessionId = session.id
        order.stripePaymentIntentId =
          session.payment_intent
        order.paidAt = new Date()

        if (order.status === 'pending') {
          order.status = 'confirmed'
        }

        await order.save()

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object

        const orderId = session.metadata?.orderId

        if (!orderId) {
          break
        }

        const order = await Order.findById(orderId)

        if (!order) {
          break
        }

        const payment = await Payment.findOne({
          order: order._id
        })

        if (
          payment &&
          payment.status === 'pending'
        ) {
          payment.status = 'failed'
          await payment.save()
        }

        break
      }

      default:
        break
    }

    return res.status(200).json({
      received: true
    })
  } catch (error) {
    console.error('Stripe webhook processing failed')

    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    })
  }
}

module.exports = {
  createCheckoutSession,
  handleStripeWebhook
}