var FITMOODLE = (function() {
	var MoodleBaseUrl = 'https://lms.monash.edu',
		tpDictonary = {
			S1: 'S1-01',
			S2: 'S2-01',
			FY: 'FY-01',
			'S2-S1': 'S2-S1-02',
			'S2-SS': 'S2-SS-02',
			SSA: 'SSA-02',
			SSB: 'SSB-01',
			'OCT-MY': 'OCT-MY-01',
			T3: 'T3-57',
			WS: 'WS-01',
			'MO-TP1': 'MO-TP1-01',
			'MO-TP2': 'MO-TP2-01',
			'MO-TP3': 'MO-TP3-01',
			'MO-TP4': 'MO-TP4-01',
			'MO-TP5': 'MO-TP5-01',
			'MO-TP6': 'MO-TP6-01'
		}, powerUsers,
		restrictionQuery,
		unitguideBaseUrl = 'https://unitguidemanager.monash.edu/';
	
	const unit = {
		shortname: (document.querySelector('span.media-body') ? document.querySelector('span.media-body').innerText : null),
		id: getUrlParameter('id'),
	}, user = {
		userEmail : document.querySelector('.myprofileitem.email') ? document.querySelector('.myprofileitem.email').innerText.toLowerCase() : null,
		userFullName: document.querySelector('.myprofileitem.fullname') ? document.querySelector('.myprofileitem.fullname').innerText : null,
		userRestriction: getUserRestriction(user.userEmail, powerUsers, restrictionQuery),
		userTurnedEditingOn = document.querySelector('body.editing') ? true : false,
	}, offering = {
		shortnameBlocks = unit.shortname.split('_'),
		unitCodes = shortnameBlocks[0].split('-'), // Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
		teachingPeriods = offering.shortnameBlocks[1].split('-'),
		campus = offering.shortnameBlocks.length > 3 ? shortnameBlocks[2].split('-') : 'Not Applicable',
		year = offering.shortnameBlocks[shortnameBlocks.length - 1].split('-'),
		teachingFaculty = offering.unitCodes[0].indexOf('MAT') > 0 ? 'Science' : 'FIT',
		location = offering.teachingPeriods[0].indexOf('MO-TP') > 0 ? 'Monash Online' : 'Campus',
	}, callista = {
		callistaNodelist: document.querySelectorAll('section.block_callista div.card-text a[onclick]'),
		addCallista: document.querySelector('section.block_callista p'),
		callistaAttachmet: callista.callistaNodelist.length > 0 ? [ ...callistacallistaNodelist ].map((x) => x.innerText) : callistaaddCallista.innerText,
	}, buttonRequirement = {
		showUnitGuide: offering.unitCodesArray[0].match(/\w{3}\d{4}/g) ? true : false, 
		showStudentPortal: offering.offeringTeachingFaculty === 'FIT' ? true : false,
		showMyGrades: querySelector("a[data-key='grades']") ? true : false,
	}, externalLinks =  {
		studentPortal : ((offering.location === 'Campus') ? this.setMoodleUrl('38028') : this.setMoodleUrl('24532'))
	},
	
		
	
	// Returns true if the user is part of list or a specefic query passed
	function getUserRestriction({ userEmail }, powerUsers, query) {
		if (userEmail === null) {
			console.log('@MS: Logged in User Block is not added, hence email can not be retrieved!');
			return true;
		} else if (powerUsers.includes(userEmail) || window.location.href.indexOf(query) > 0) {
			// I am an allowed user
			console.log('@MS: allowed user = ', userEmail);
			return false;
		} else {
			console.log('@MS: restricted user = ', userEmail);
			return true;
		}
	}

	// returns Unit Guide Button info given Unit Code, Teaching Period, and Year
	function buildUnitGuideViewUrl (unitCode, tpCode, tpYear) {
		return {
			href: unitguideBaseUrl + 'view?' + 'unitCode=' + unitCode +	'&tpCode=' + tpDict[tpCode] +	'&tpYear=' + tpYear,
			text: unitCode + ' Unit Guide'
		};
	}

	function buildUnitGuideSearchUrl (faculty) {
		return {
			href: unitguideBaseUrl + 'refine?faculty=' + faculty,
			text: 'Search Unit Guides'
		};
	}

	function getOfficialTeachingPeriod (tp) {
		return tpDictonary[tp];
	}

	// Add a button
	function addButtonToElement(elementId = 'QuickLink', elementClass = 'btn btn-link btn-sm btn-block quick-link-button', elementHRef, elementText) {
		document.getElementById(elementId).innerHTML += '<a class="' + elementClass + '" href="' + elementHRef + '" role="button" target="_blank">' +	elementText + '</a>';
	}

	// methods are avaiable for use
	return {
		printMoodleShortname: function() {
			console.log(unit)
			console.log(user);
			console.log(offering);
			console.log(callista)
			return this 
		},
		setMoodlePowerUsers: function(emialArray) {
			if (Array.isArray(emialArray)) {
				return emialArray;
			} else {
				return powerUsers;
			}
		}
	};
})();
