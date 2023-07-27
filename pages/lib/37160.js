import { assert as _assert } from "./assertions";

class Version {
  constructor(major, minor) {
    this._major = major;
    this._minor = minor;
  }

  major() {
    return this._major;
  }

  minor() {
    return this._minor;
  }

  isZero() {
    return this._major === 0 && this._minor === 0;
  }

  toString() {
    return this._major + "." + this._minor;
  }

  compareTo(other) {
    if (this._major < other._major) {
      return -1;
    } else if (this._major > other._major) {
      return 1;
    } else if (this._minor < other._minor) {
      return -1;
    } else if (this._minor > other._minor) {
      return 1;
    } else {
      return 0;
    }
  }

  isLess(other) {
    return this.compareTo(other) < 0;
  }

  isLessOrEqual(other) {
    return this.compareTo(other) <= 0;
  }

  isEqual(other) {
    return this.compareTo(other) === 0;
  }

  isGreater(other) {
    return this.compareTo(other) > 0;
  }

  isGreaterOrEqual(other) {
    return this.compareTo(other) >= 0;
  }

  static parse(version) {
    if (version instanceof Version) {
      return new Version(version.major(), version.minor());
    } else if (typeof version === "number") {
      _assert(
        Math.floor(version) === version,
        "Version should not be a float number"
      );
      return new Version(version, 0);
    } else if (typeof version === "string") {
      const parts = version.split(".");
      if (parts.length === 1) {
        const major = parseInt(parts[0], 10);
        _assert(!isNaN(major), "Bad version string: " + version);
        return new Version(major, 0);
      } else if (parts.length === 2) {
        const major = parseInt(parts[0], 10);
        _assert(!isNaN(major), "Bad version string: " + version);
        const minor = parseInt(parts[1], 10);
        _assert(!isNaN(minor), "Bad version string: " + version);
        return new Version(major, minor);
      } else {
        throw new Error("Bad version string (one dot expected): " + version);
      }
    } else {
      throw new Error("Bad version: " + version);
    }
  }
}

Version.ZERO = new Version(0, 0);

export { Version };
