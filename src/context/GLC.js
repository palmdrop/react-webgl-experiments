class GLCommander {
    constructor() {
        this.initialized = false;

        // Map for storing uniform locations
        // {program, uniformName} => uniformLocation
        this.uniformLocations = new Map();
    }

    // Initialize the canvas and webgl context variables
    init(canvas, gl) {
        this.canvas = canvas;
        this.gl = gl;
        this.initialized = true;
    }

    isInitialized() {
        return this.initialized;
    }

    // Clear the canvas (both color and depth information)
    clear = (r, g, b, a) => {
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    // Sets the viewport of the webgl context
    setViewport(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    // Creates a shader program, loads with shader source, compiles, links, and verifies
    createShaderProgram(vertexSource, fragmentSource) {
        const validateShader = (shader, shaderType) => {
            if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.error('ERROR compiling ' + shaderType + ' shader', this.gl.getShaderInfoLog(shader));
                return false;
            }
            return true;
        }

        var vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vs, vertexSource);
        this.gl.shaderSource(fs, fragmentSource);

        this.gl.compileShader(vs);

        if(!validateShader(vs, 'vertex')) return -1;

        this.gl.compileShader(fs);

        if(!validateShader(fs, 'fragment')) return -1;

        var program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);

        this.gl.linkProgram(program);

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('ERROR linking program', this.gl.getProgramInfoLog(program));
            return -1;
        }

        this.gl.validateProgram(program);
        if(!this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program', this.gl.getProgramInfoLog(program));
            return -1;
        }

        return program;
    }

    // Creates an arbitrary webgl buffer and loads it with data
    createBuffer(bufferType, data, drawMode) {
        var buffer = this.gl.createBuffer();
        this.bindBuffer(bufferType, buffer);
        this.gl.bufferData(bufferType, new Float32Array(data), drawMode);
    }

    // Binds a buffer
    bindBuffer(bufferType, buffer) {
        this.gl.bindBuffer(bufferType, buffer);
    }

    // Sets and enables a shader attribute
    setAttribLayout(program, name, numberOfElements, type, vertexSize, offset) {
        var location = this.gl.getAttribLocation(program, name);

        if(location === -1) {
            return -1;
        }

        this.gl.vertexAttribPointer(
            location,
            numberOfElements,
            type,
            this.gl.FALSE,
            vertexSize,
            offset
        );
        this.gl.enableVertexAttribArray(location);
    }

    // Enables a specific shader
    setShaderProgram(program) {
        this.gl.useProgram(program);
    }

    // Sets the uniform value of a specific shader
    // Type corresponds to the webgl API uniform setters
    // For example, if "value" is an integer, then "type" should be "1i"
    // If "value" is a float array with three elements, "type" should be "3fv", and so on
    setUniform(program, name, type, value) {
        // Store the locations in a map, to avoid having to unnecessary uniform location lookups
        const key = { program, name };
        var location = this.uniformLocations.get(key);
        if(typeof location === 'undefined') {
            location = this.gl.getUniformLocation(program, name);
            this.uniformLocations.set(key, location);
        }

        // Set value
        this.gl["uniform" + type](location, value);
    }

    // Draws a specified number of vertices
    draw(numberOfVertices) {
        this.gl.drawArrays(this.gl.TRIANGLES,  0, numberOfVertices);
    }

    // Returns the webgl context
    getGL() {
        return this.gl;
    }
}

// Create and export a static GLC instance which can be used globally
const GLC = new GLCommander();
export default GLC;