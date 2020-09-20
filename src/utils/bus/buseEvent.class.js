class busEvent {
  constructor(vmBus, eventName, fn = () => {}) {
    this.bus = vmBus
    this.eventName = eventName
    this.fn = fn
  }
}