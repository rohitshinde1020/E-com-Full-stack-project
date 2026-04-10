import React from 'react'
import { assets } from '../assets/assets'

const policyItems = [
	{
		icon: 'quality_icon',
		title: 'Shipping Policy',
		summary: 'Fast and reliable delivery with clear tracking on every order.',
		points: [
			'Standard delivery in 3-7 business days.',
			'Express delivery in 1-2 business days for selected locations.',
			'Tracking details are shared by email once your order ships.'
		]
	},
	{
		icon: 'exchange_icon',
		title: 'Return and Refund Policy',
		summary: 'Easy returns and transparent refunds for eligible products.',
		points: [
			'Return window is 7 days from delivery date.',
			'Items must be unused, unwashed, and with original tags attached.',
			'Refunds are processed to original payment method within 5-7 business days after quality check.'
		]
	},
	{
		icon: 'exchange_icon',
		title: 'Cancellation Policy',
		summary: 'Cancel quickly before dispatch without any hassle.',
		points: [
			'Orders can be cancelled before they are packed or shipped.',
			'If already shipped, cancellation is not possible and return policy applies.',
			'Any successful cancellation is refunded automatically.'
		]
	},
	{
		icon: 'quality_icon',
		title: 'Payment and Security Policy',
		summary: 'Safe checkout with trusted payment options and data protection.',
		points: [
			'Supported methods include cards, UPI, net banking, and wallets.',
			'All payments are processed through secure gateways with encryption.',
			'We do not store your full card details on our servers.'
		]
	},
	{
		icon: 'quality_icon',
		title: 'Privacy Policy',
		summary: 'Your personal information is protected and used responsibly.',
		points: [
			'Personal data is used only to process orders and improve your experience.',
			'Marketing communication is optional and can be unsubscribed anytime.',
			'We never sell user data to third parties.'
		]
	},
	{
		icon: 'support_img',
		title: 'Customer Support Policy',
		summary: 'Quick help whenever you need assistance.',
		points: [
			'Support available Monday to Saturday, 9 AM to 8 PM.',
			'Average response time is within 24 hours.',
			'Contact via email, chat, or help center form.'
		]
	}
]

const Policy = () => {
	return (
		<section className='relative overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-10'>
			<div className='absolute -left-12 top-8 h-40 w-40 rounded-full bg-orange-200/35 blur-3xl' />
			<div className='absolute -right-10 top-20 h-52 w-52 rounded-full bg-teal-200/35 blur-3xl' />

			<div className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/90 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8 lg:p-10'>
				<p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600'>
					Store Policies
				</p>

				<h2 className='mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl'>
					Shop With Full Confidence
				</h2>

				<p className='mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base'>
					These policies keep your shopping experience simple, safe, and transparent. Please review them before placing an order.
				</p>

				<div className='mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{policyItems.map((item) => (
						<article
							key={item.title}
							className='rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
						>
							<div className='flex items-center gap-3'>
								<div className='flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50'>
									<img
										src={assets[item.icon]}
										alt={item.title}
										className='h-6 w-6 object-contain'
									/>
								</div>
								<h3 className='text-lg font-semibold text-neutral-900'>{item.title}</h3>
							</div>
							<p className='mt-2 text-sm text-neutral-600'>{item.summary}</p>

							<ul className='mt-4 space-y-2 text-sm text-neutral-700'>
								{item.points.map((point) => (
									<li key={point} className='flex items-start gap-2'>
										<span className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900' />
										<span>{point}</span>
									</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Policy
