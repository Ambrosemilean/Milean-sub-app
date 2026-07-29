import { ArrowRightIcon, BanknotesIcon, BoltIcon, DevicePhoneMobileIcon, ShieldCheckIcon, WifiIcon } from '@heroicons/react/24/outline'

type Module = {
  title: string
  description: string
  features: string[]
  accent: string
}

const customerModules: Module[] = [
  {
    title: 'Landing & Onboarding',
    description: 'Public product pages plus guided signup for web and Android customers.',
    features: ['Hero banner', 'Pricing', 'FAQs', 'Login', 'Register', 'OTP verification'],
    accent: 'from-sky-500 to-cyan-400',
  },
  {
    title: 'Dashboard',
    description: 'A single financial home with balances, insights, quick actions, and alerts.',
    features: ['Wallet balance', 'Recent transactions', 'Notifications', 'Airtime', 'Data', 'Bills'],
    accent: 'from-blue-600 to-indigo-500',
  },
  {
    title: 'Wallet & Transfers',
    description: 'Core banking workflows for deposits, withdrawals, internal and bank transfers.',
    features: ['Deposit', 'Withdraw', 'Bank accounts', 'Beneficiaries', 'QR pay', 'Scheduled transfers'],
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    title: 'Subscriptions',
    description: 'Bill payments for everyday Nigerian services and recurring subscriptions.',
    features: ['Airtime', 'Data', 'Electricity', 'Cable TV', 'Internet', 'Education pins'],
    accent: 'from-orange-500 to-amber-400',
  },
  {
    title: 'Cards, Savings & Loans',
    description: 'Value-added banking products that increase retention and revenue.',
    features: ['Virtual dollar card', 'Freeze card', 'Daily savings', 'Goal savings', 'Loan eligibility', 'Repayment'],
    accent: 'from-fuchsia-500 to-pink-500',
  },
  {
    title: 'Profile & Security',
    description: 'Customer controls for identity, KYC, device protection, and account recovery.',
    features: ['Edit profile', 'BVN/NIN KYC', 'Transaction PIN', 'Password', '2FA', 'Device tracking'],
    accent: 'from-slate-700 to-slate-500',
  },
]

const adminModules = [
  'User management',
  'Wallet management',
  'Transactions',
  'KYC verification',
  'Support tickets',
  'Revenue analytics',
  'Product pricing',
  'API settings',
  'Reports',
  'CMS',
  'Roles & permissions',
]

const services = [
  { name: 'Airtime', providers: 'MTN, Airtel, Glo, 9mobile', icon: DevicePhoneMobileIcon },
  { name: 'Data', providers: 'SME, corporate and direct bundles', icon: WifiIcon },
  { name: 'Electricity', providers: 'EKEDC, IKEDC, PHED, AEDC and more', icon: BoltIcon },
  { name: 'Cable TV', providers: 'DStv, GOtv and Startimes', icon: BanknotesIcon },
]

const architecture = [
  'React + Vite + TypeScript web app',
  'Flutter Android app consuming the same API',
  'Node.js/Express backend with PostgreSQL, Redis and Prisma',
  'JWT, refresh tokens, OTP, transaction PIN and role-based access',
  'Integrations prepared for Monnify, Paystack, Flutterwave and VTpass',
]

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative isolate overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_30%)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 font-black text-slate-950">MP</div>
            <div>
              <p className="text-lg font-bold">Milean Pay</p>
              <p className="text-xs text-slate-300">Web + Android banking</p>
            </div>
          </div>
          <a href="#modules" className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-cyan-100 hover:bg-white/10">
            View modules
          </a>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-300/20">
              Production-ready fintech blueprint
            </p>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Banking, airtime, data and subscriptions in one Milean Pay app.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Milean Pay is structured as a shared financial platform for responsive web and Android experiences, covering onboarding, wallets, transfers, bill payments, security, and administration.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#services" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300">
                Explore services <ArrowRightIcon className="h-5 w-5" />
              </a>
              <a href="#architecture" className="rounded-full bg-white/10 px-6 py-3 font-bold text-white ring-1 ring-white/15 hover:bg-white/15">
                See architecture
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Wallet balance</p>
                <ShieldCheckIcon className="h-7 w-7 text-emerald-300" />
              </div>
              <p className="mt-3 text-4xl font-black">₦245,800.00</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {['Send Money', 'Buy Airtime', 'Buy Data', 'Pay Bills'].map((action) => (
                  <button className="rounded-2xl bg-white/10 px-4 py-4 font-semibold hover:bg-cyan-400 hover:text-slate-950" key={action}>{action}</button>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {['DStv subscription paid', 'MTN data bundle', 'Transfer to Ada'].map((item) => (
                  <div className="flex items-center justify-between rounded-2xl bg-slate-800 px-4 py-3" key={item}>
                    <span>{item}</span>
                    <span className="text-emerald-300">Success</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="bg-slate-100 px-6 py-20 text-slate-950 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold text-cyan-700">Different page modules</p>
            <h2 className="mt-3 text-4xl font-black">Customer journeys split into clear, buildable modules.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {customerModules.map((module) => (
              <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200" key={module.title}>
                <div className={`mb-5 h-2 w-24 rounded-full bg-gradient-to-r ${module.accent}`} />
                <h3 className="text-2xl font-black">{module.title}</h3>
                <p className="mt-3 text-slate-600">{module.description}</p>
                <ul className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
                  {module.features.map((feature) => <li key={feature}>• {feature}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-4">
            {services.map(({ name, providers, icon: Icon }) => (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6" key={name}>
                <Icon className="h-10 w-10 text-cyan-300" />
                <h3 className="mt-5 text-2xl font-black">{name}</h3>
                <p className="mt-3 text-slate-300">{providers}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="bg-white px-6 py-20 text-slate-950 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-bold text-cyan-700">Shared platform architecture</p>
            <h2 className="mt-3 text-4xl font-black">One secure backend for web, Android and admin operations.</h2>
            <ul className="mt-8 space-y-4">
              {architecture.map((item) => <li className="rounded-2xl bg-slate-100 p-4 font-semibold" key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl bg-slate-950 p-8 text-white">
            <h3 className="text-3xl font-black">Admin dashboard</h3>
            <p className="mt-3 text-slate-300">Operational modules for compliance, support, revenue and service configuration.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {adminModules.map((module) => <span className="rounded-full bg-white/10 px-4 py-3 text-sm font-semibold" key={module}>{module}</span>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
