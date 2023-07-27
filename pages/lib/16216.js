const services = {};
const servicePromises = new Map();

function registerService(serviceId, implementation) {
  if (hasService(serviceId)) {
    throw new Error("Service already registered");
  }
  services[serviceId] = implementation;
  const servicePromise = servicePromises.get(serviceId);
  if (servicePromise !== undefined) {
    servicePromises.delete(serviceId);
    servicePromise.resolve(implementation);
  }
}

function hasService(serviceId) {
  return services.hasOwnProperty(serviceId);
}

function service(serviceId) {
  const implementation = services[serviceId];
  if (implementation === undefined) {
    throw new Error(`ServiceLocator: Service ${serviceId} not found`);
  }
  return implementation;
}
