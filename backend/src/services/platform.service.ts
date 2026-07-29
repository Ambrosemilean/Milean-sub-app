export const applicationModules = [
  { name: 'Landing', status: 'implemented', channels: ['web'] },
  { name: 'Authentication', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Wallet', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Internal Transfers', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Airtime', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Data', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Cable TV', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Electricity', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Internet', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Betting', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Education', status: 'implemented', channels: ['api', 'web', 'android'] },
  { name: 'Virtual Cards', status: 'schema-ready', channels: ['api', 'web', 'android'] },
  { name: 'Savings', status: 'schema-ready', channels: ['api', 'web', 'android'] },
  { name: 'Loans', status: 'schema-ready', channels: ['api', 'web', 'android'] },
  { name: 'Notifications', status: 'schema-ready', channels: ['api', 'web', 'android'] },
  { name: 'Admin Dashboard', status: 'planned', channels: ['web'] },
]

export function getApplicationModules() {
  return applicationModules
}
