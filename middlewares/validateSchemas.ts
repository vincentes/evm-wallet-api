const inputs = (schema : any, property : any) => {
  return (req : any, res : any, next : any) => {
    const { error } : any = schema.validate(req[property]);
    const valid = error == null;
    if (valid) next();
    else {
      const { details } = error;
      const message = details.map((i : any) => i.message).join(',');
      res.status(422).json({ error: message, status: 422 });
    }
  };
};

export default { inputs };
