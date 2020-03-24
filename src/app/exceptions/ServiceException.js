class ServiceException extends Error {
  constructor(code = 'BAD_REQUEST', status = 400, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceException);
    }

    this.code = code;
    this.status = status;
  }
}

export default ServiceException;
