import { LevelsProperty } from "some-library"; // ! Replace 'some-library' with the actual library you're using
import { LineToolPitchfork } from "some-library"; // ! Replace 'some-library' with the actual library you're using

class LineToolSchiffPitchfork extends LineToolPitchfork {
  constructor(name, properties, model, options) {
    super(
      name,
      properties || LineToolSchiffPitchfork.createProperties(),
      model,
      options
    );
  }

  name() {
    return "Modified Schiff Pitchfork";
  }

  static createProperties(instance) {
    const property = new LevelsProperty(
      "linetoolschiffpitchfork",
      instance,
      false,
      { range: [0, 8] }
    );
    this._configureProperties(property);
    return property;
  }
}

export default LineToolSchiffPitchfork;
