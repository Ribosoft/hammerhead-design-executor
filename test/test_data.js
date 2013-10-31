module.exports = {
    longSequence : {
	request : {
	    sequence : 'AUUGUACGCGUCAUGCAUAGCACGAUGCAUGCUC',
	    foldShape : 'Basic',
	    temperature : 37,
	    naC: 150,
	    mgC: 0,
	    oligoC: 0,
	    cutsites: ['GUC'],
	    region: '5\'',
	    left_arm_min : 3,
	    left_arm_max : 8,
	    right_arm_min : 3,
	    right_arm_max : 8,
	    emailUser : '',
	    env: {
		type: 'vitro',
		target: ''
	    }
	},
	results : {},
	duration : {
	    remainingDuration : 234,
	    unit: 'min'
	},
	newRequest: {
	    sequence : 'ATGC',
	    foldShape : 'Basic',
	    temperature : 37,
	    naC: 150,
	    mgC: 0,
	    oligoC: 0,
	    cutsites: ['GUC'],
	    region: '5\'',
	    left_arm_min : 3,
	    left_arm_max : 8,
	    right_arm_min : 3,
	    right_arm_max : 8,
	    emailUser : 'test@test.test',
	    env: {
		type: 'vitro',
		target: ''
	    }
	}
    }
};
