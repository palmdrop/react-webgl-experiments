const noiseSettings = () => {
    return {
        value: {
            frequency: {
                value: Math.random() * 0.01,
                min: 0.0000001,
                max: 0.035,
                type: "1f",
            },
            octaves: {
                value: 3,
                type: "1i",
                min: 1,
                max: 5,
                step: 2,
                marks: [1, 3, 5]
            },
            lacunarity: {
                value: 2.0,
                type: "1f",
                min: 0.1,
                max: 5.0,
            },
            persistence: {
                value: 0.5,
                type: "1f",
                min: 0.1,
                max: 2.0,
            },
            amplitude: {
                value: 1.0,
                type: "1f",
                min: 0.1,
                max: 5.0,
            },
            modifications: {
                value: {
                    ridgeThreshold: {
                        value: 1.0,
                        type: "1f",
                        min: 0.5,
                        max: 1.0,
                    },
                    pow: {
                        value: 1.0,
                        type: "1f",
                        min: 0.0,
                        max: 5
                    }
                },
            }
        },
        isUniform: true,
    }
};

const timeSettings = (value) => {
    return {
        value: value,
        min: 0.0,
        max: 3,
    }
};


const getDefaultAttributes = () => {
    return {
        scale: {
            value: 1.0,
            isUniform: true,
            type: "1f",

            min: 0.01,
            max: 10
        },
        iterations: {
            value: 2,
            isUniform: true,
            type: "1i",

            min: 0,
            max: 4,
        },
        warpAmount: {
            value: 100,
            isUniform: true,
            type: "1f",

            min: 0.0,
            max: 1000
        },
        multisampling: {
            value: 0,
            isUniform: true,
            type: "1i",

            min: 0,
            max: 1
        },
        animationSpeed: {
            value: {
                general: timeSettings(0.2),
                source: timeSettings(1.0),
                angleControl: timeSettings(1.0),
                amountControl: timeSettings(1.0)
            },
            isUniform: false,
        },

        source: noiseSettings(),
        angleControl: noiseSettings(),
        amountControl: noiseSettings()
    };
}

export { getDefaultAttributes }