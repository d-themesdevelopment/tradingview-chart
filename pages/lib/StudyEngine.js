class StudyEngine {
    constructor(e) {
        this.runner = new A(e)
    }
    
    stop() {
        this.runner.stop()
    }
    
    isStarted() {
        return this.runner.isStarted
    }
}

export {StudyEngine};