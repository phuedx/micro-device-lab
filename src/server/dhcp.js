const readFile = require('fs').readFile
const parseClientLeases = require('dhcpd-leases')

function createActiveClients (leases) {
  var activeClients = []
  var lease

  for (var ip in leases) {
    lease = leases[ip]

    if (lease['binding state'] === 'active') {
      activeClients.push({
        ip,
        mac: lease['hardware ethernet'],
        hostname: lease['client-hostname']
      })
    }
  }

  return activeClients
}

function createDhcpService (clientLeasesFile) {
  function getClientLeases() {
    return new Promise((resolve, reject) => {
      readFile(clientLeasesFile, 'utf-8', (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(data)
      })
    })
  }

  function getActiveClients () {
    return getClientLeases()
      .then(parseClientLeases)
      .then(createActiveClients)
  }

  function getActiveClient (mac) {
    return getActiveClients()
      .then((clients) => clients.filter(
        (client) => client.mac === mac
      ))
      .then((clients) => {
        // If a MAC address resolves to more than one active DHCP client, then panic!
        if (clients.length > 1) {
          throw new Error(`MAC ${mac} resolved to more than one active DHCP client.`)
        }

        return clients.length ? clients[0] : null
      })
  }

  return {
    getActiveClients,
    getActiveClient
  }
}

module.exports = createDhcpService
