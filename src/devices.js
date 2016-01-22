'use strict'

function createDeviceService (dhcpService, profileService) {
  function createDevice (client) {
    return {
      dhcp: client,
      profile: profileService.getProfile(client.ip)
    }
  }

  function getDevices () {
    return dhcpService.getActiveClients()
      .then((clients) => clients.map(createDevice))
  }

  function getDevice (mac) {
    return dhcpService.getActiveClient(mac)
      .then((client) => createDevice(client))
  }

  function setDeviceProfile (device, profile) {
    profileService.setProfile(device.dhcp.ip, profile)
  }

  return {
    getDevices,
    getDevice,
    setDeviceProfile
  }
}

module.exports = createDeviceService
