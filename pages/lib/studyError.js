export class StudyError extends Error {
    constructor(message) {
      super(message);
      this.studyError = true;
    }
  }
  