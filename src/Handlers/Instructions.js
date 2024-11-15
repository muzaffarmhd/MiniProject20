// Import necessary modules (if any)
import * as THREE from 'three';
class Instruction {
    constructor() {
        if (!Instruction.instance) {
            this.duration = 10000; // Display duration in milliseconds (10 seconds)
            this.active = false;
            this.timer = null;

            // Create instruction and timer bar elements
            this.instructionElement = this.createInstructionElement();
            this.progressBarElement = this.createProgressBarElement();

            // Append the progress bar to the instruction element
            this.instructionElement.appendChild(this.progressBarElement);
            document.body.appendChild(this.instructionElement);

            Instruction.instance = this;
        }
        return Instruction.instance;
    }

    createInstructionElement() {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.top = '20px';
        element.style.left = '50%';
        element.style.transform = 'translateX(-50%)';
        element.style.padding = '10px 20px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        element.style.color = '#fff';
        element.style.fontSize = '20px';
        element.style.borderRadius = '5px';
        element.style.textAlign = 'center';
        element.style.display = 'none'; // Initially hidden
        return element;
    }

    createProgressBarElement() {
        const progressBar = document.createElement('div');
        progressBar.style.position = 'relative';
        progressBar.style.width = '100%';
        progressBar.style.height = '5px';
        progressBar.style.backgroundColor = '#555';
        progressBar.style.marginTop = '10px';

        const progress = document.createElement('div');
        progress.style.width = '100%'; // Start with full width, will animate to 0%
        progress.style.height = '100%';
        progress.style.backgroundColor = '#ffffff';
        progress.style.transition = `width ${this.duration}ms linear`; // Animate width over duration

        progressBar.appendChild(progress);
        return progressBar;
    }

    show(message) {
        if (this.active) return;

        this.active = true;
        this.instructionElement.textContent = message;
        this.instructionElement.style.display = 'block';

        // Animate the progress bar by setting width to 0% over the duration
        this.progressBarElement.firstChild.style.width = '0%';

        // Hide instruction and reset after the specified duration
        this.timer = setTimeout(() => {
            this.instructionElement.style.display = 'none';
            this.active = false;
            this.progressBarElement.firstChild.style.width = '100%'; // Reset the bar width for future use
        }, this.duration);
    }

    clear() {
        if (this.timer) clearTimeout(this.timer);
        this.instructionElement.style.display = 'none';
        this.active = false;
        this.progressBarElement.firstChild.style.width = '100%'; // Reset the bar width
    }
}

// Ensure it works as a singleton
const instruction = new Instruction();

export default instruction;
