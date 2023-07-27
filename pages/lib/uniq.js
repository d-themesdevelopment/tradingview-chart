function uniq(e) {
    return e.reduce((result, value) => {
      if (!result.includes(value)) {
        result.push(value);
      }
      return result;
    }, []);
  }