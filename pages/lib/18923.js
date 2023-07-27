import { assert } from "./assertions";

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
    return `${this._major}.${this._minor}`;
  }

  compareTo(otherVersion) {
    if (this._major < otherVersion._major) {
      return -1;
    } else if (this._major > otherVersion._major) {
      return 1;
    } else if (this._minor < otherVersion._minor) {
      return -1;
    } else if (this._minor > otherVersion._minor) {
      return 1;
    } else {
      return 0;
    }
  }

  isLess(otherVersion) {
    return this.compareTo(otherVersion) < 0;
  }

  isLessOrEqual(otherVersion) {
    return this.compareTo(otherVersion) <= 0;
  }

  isEqual(otherVersion) {
    return this.compareTo(otherVersion) === 0;
  }

  isGreater(otherVersion) {
    return this.compareTo(otherVersion) > 0;
  }

  isGreaterOrEqual(otherVersion) {
    return this.compareTo(otherVersion) >= 0;
  }

  static parse(version) {
    if (version instanceof Version) {
      return new Version(version.major(), version.minor());
    }
    if (typeof version === "number") {
      assert(
        Math.floor(version) === version,
        "Version should not be a float number"
      );
      return new Version(version, 0);
    }
    if (typeof version === "string") {
      const parts = version.split(".");
      if (parts.length === 1) {
        const major = parseInt(parts[0], 10);
        assert(!isNaN(major), "Bad version string: " + version);
        return new Version(major, 0);
      }
      if (parts.length === 2) {
        const major = parseInt(parts[0], 10);
        assert(!isNaN(major), "Bad version string: " + version);
        const minor = parseInt(parts[1], 10);
        assert(!isNaN(minor), "Bad version string: " + version);
        return new Version(major, minor);
      }
      throw new Error("Bad version string (one dot expected): " + version);
    }
    throw new Error("Bad version: " + version);
  }
}

Version.ZERO = new Version(0, 0);

export { Version };
