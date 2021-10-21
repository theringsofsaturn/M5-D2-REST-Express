export const badRequestError = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const unauthorizedError = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const forbidenError = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const notFoundError = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ success: false, message: err.message });
  } else {
    next(err);
  }
};

export const genericServerError = (err, req, res, next) => {
  res.status(500).send({ success: false, message: "Generic Server Error" });
  console.log(err);
};
