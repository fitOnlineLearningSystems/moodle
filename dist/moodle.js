var FITMOODLE = (function() {
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

	// Detemines which button requires given unit code
	function requiresUnitGuide({ unitCodesArray }) {
		return unitCodesArray[0].match(/\w{3}\d{4}/g) ? true : false;
	}
	// Detemines which button requires given teaching faculty
	function requiresStudentPortal({ offeringTeachingFaculty }) {
		return offeringTeachingFaculty === 'FIT' ? true : false;
	}
	// Detemines which button requires given wether grade is enabled in the Unit Edit Settings
	function requiresMoodleGardePage() {
		return querySelector("a[data-key='grades']") ? true : false;
	}

	// Extract various information given the Moodle Shortname
	function extractOfferingInfo(unitShortname) {
		// Extracting naming blocks from input (e.g., FITXXXX, S1, 2019 from FITXXXX_S1_2019)
		var shortnameBlocks = unitShortname.split('_'),
			offeringUnitCodes = shortnameBlocks[0].split('-'), // Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
			offeringTeachingPeriods = shortnameBlocks[1].split('-'),
			offeringCampus = shortnameBlocks.length > 3 ? shortnameBlocks[2].split('-') : 'Not Applicable',
			offeringYear = shortnameBlocks[shortnameBlocks.length - 1].split('-'),
			offeringTeachingFaculty = offeringUnitCodes[0].indexOf('MAT') > 0 ? 'Science' : 'FIT',
			offeringClass = offeringTeachingPeriods[0].indexOf('MO-TP') > 0 ? 'MO' : 'Campus';

		return {
			offeringUnitCodes: offeringUnitCodes,
			offeringTeachingPeriods: offeringTeachingPeriods,
			offeringCampus: offeringCampus,
			offeringYear: offeringYear,
			offeringTeachingFaculty: offeringTeachingFaculty,
			offeringClass: offeringClass
		};
	}

	// Add a button
	function addButtonToElement(
		elementId = 'QuickLink',
		elementClass = 'btn btn-link btn-sm btn-block quick-link-button',
		elementHRef,
		elementText
	) {
		document.getElementById(elementId).innerHTML +=
			'<a class="' +
			elementClass +
			'" href="' +
			elementHRef +
			'" role="button" target="_blank">' +
			elementText +
			'</a>';
	}

	// methods are avaiable for use
	return {
		getMoodleShortname: function() {
			const unitShortname = document.querySelector('span.media-body')
				? document.querySelector('span.media-body').innerText
				: null;

			return {
				unitShortname: unitShortname,
				...extractOfferingInfo(unitShortname)
			};
		},
		getMoodleNavDrawer: function() {
			const unitUrl = document.querySelector("a[data-key='coursehome']")
					? document.querySelector("a[data-key='coursehome']").getAttribute('href')
					: null,
				unitGradeUrl = document.querySelector("a[data-key='grades']")
					? document.querySelector("a[data-key='grades']").getAttribute('href')
					: null,
				unitId = getUrlParameter('id');

			return {
				unitUrl: unitUrl,
				unitGradeUrl: unitGradeUrl,
				unitId: unitId
			};
		},
		getMoodleUser: function() {
			const userEmail = document.querySelector('.myprofileitem.email')
					? document.querySelector('.myprofileitem.email').innerText.toLowerCase()
					: null,
				userFullName = document.querySelector('.myprofileitem.fullname')
					? document.querySelector('.myprofileitem.fullname').innerText
					: null,
				userTurnedEditingOn = document.querySelector('body.editing') ? true : false;

			return {
				userEmail: userEmail,
				userFullName: userFullName,
				userTurnedEditingOn: userTurnedEditingOn,
				userRestriction: getUserRestriction(userEmail)
			};
		},
		getCallistaAttachment: function() {
			const callistaNodelist = document.querySelectorAll('section.block_callista div.card-text a[onclick]'),
				addCallista = document.querySelector('section.block_callista p');

			return callistaNodelist.length > 0
				? [ ...callistaNodelist ].map((x) => x.innerText)
				: addCallista.innerText;
		},
		getQuickLinkRequirments: function() {
			const unitInfo = getMoodleShortname(),
				studentPortalButton = requiresStudentPortal(unitInfo),
				myGradeButton = requiresMoodleGardePage(),
				unitGuideButton = requiresUnitGuide(unitInfo);

			return {
				studentPortalButton: studentPortalButton,
				myGradeButton: myGradeButton,
				unitGuideButton: unitGuideButton
			};
		},
		setMoodleBaseUrl: function(url) {
			return url.toString();
		},
		setMoodleViewUrl: function(id) {
			return setMoodleBaseUrl() + '/course/view.php?id=' + id;
		},
		setMoodlePortalURL: function({ offeringClass }) {
			return offeringClass === 'Campus' ? this.setMoodleUrl('38028') : this.setMoodleUrl('24532');
		},
		setUnitGuideBaseUrl: function(url) {
			return url;
		},
		setUnitGuideViewUrl: function(unitCode, tpCode, tpYear) {
			return {
				href:
					unitguideBaseUrl() +
					'view?' +
					'unitCode=' +
					unitCode +
					'&tpCode=' +
					tpDict[tpCode] +
					'&tpYear=' +
					tpYear,
				text: unitCode + ' Unit Guide'
			};
		},
		setUnitGuideSearchUrl: function(faculty) {
			return {
				href: unitguideBaseUrl() + 'refine?faculty=' + faculty,
				text: 'Search Unit Guides'
			};
		},
		getOfficialTeachingPeriod: function(tp) {
			const tpDictonary = {
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
			};
			return tpDictonary[tp];
		},
		setMoodlePowerUsers: function(emialArray) {
			if (emialArray && Array.isArray(emialArray)) {
				return emialArray;
			} else {
				return powerUsers;
			}
		}
	};
})();
