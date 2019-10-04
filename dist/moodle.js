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
		},
		powerUsers = [],
		avoidRestrictionQuery = 'restriction=off',
		unitguideBaseUrl = 'https://unitguidemanager.monash.edu/',
		unitguideSearchQuery = 'faculty=FACULTY+OF+INFORMATION+TECHNOLOGY',
		urlParams = new URLSearchParams(new URL(document.URL).search),
		unit = new function() {
			this.shortname = document.querySelector('span.media-body')
				? document.querySelector('span.media-body').innerText
				: null;
			this.id = urlParams.has('id') ? urlParams.get('id') : 'Not a Moodle unit';
			gradeUrl = document.querySelector("a[data-key='grades']")
				? document.querySelector("a[data-key='grades']").getAttribute('href')
				: null;
		}(),
		user = new function() {
			this.email = document.querySelector('.myprofileitem.email')
				? document.querySelector('.myprofileitem.email').innerText.toLowerCase()
				: null;
			this.fullName = document.querySelector('.myprofileitem.fullname')
				? document.querySelector('.myprofileitem.fullname').innerText
				: null;
			this.restriction =
				powerUsers.includes(this.email) || window.location.href.indexOf(avoidRestrictionQuery) > 0
					? false
					: true; // Returns true if the user is part of list or a specefic query passed
			this.turnedEditingOn = document.querySelector('body.editing') ? true : false;
		}(),
		offering = new function() {
			this.shortnameBlocks = unit.shortname.split('_');
			this.unitCodes = this.shortnameBlocks[0].split('-'); // Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
			this.teachingPeriodBlock = this.shortnameBlocks[1];
			this.teachingPeriods = this.teachingPeriodBlock.split('-');
			this.campus = this.shortnameBlocks.length > 3 ? this.shortnameBlocks[2].split('-') : 'Not Applicable';
			this.year = this.shortnameBlocks[this.shortnameBlocks.length - 1].split('-');
			this.teachingFaculty = this.unitCodes[0].indexOf('MAT') > 0 ? 'Science' : 'FIT';
			this.location = this.teachingPeriods[0].indexOf('MO-TP') > 0 ? 'Monash Online' : 'Campus';
		}(),
		callista = new function() {
			this.nodelist = document.querySelectorAll('section.block_callista div.card-text a[onclick]');
			this.noCallista = document.querySelector('section.block_callista p');
			this.Attachmet =
				this.nodelist.length > 0 ? [ ...this.nodelist ].map((x) => x.innerText) : this.noCallista.innerText;
		}();

	// Specify the condition where a button is required or not
	function buttonRequired() {
		return {
			unitGuide: offering.unitCodes[0].match(/\w{3}\d{4}/g) && callista.nodelist.length > 1 ? true : false,
			studentPortal: offering.teachingFaculty === 'FIT' ? true : false,
			myGrades: document.querySelector("a[data-key='grades']") ? true : false
		};
	}

	function buildMoodleViewUrl(id) {
		return MoodleBaseUrl + id;
	}

	// returns Unit Guide Button info given Unit Code, Teaching Period, and Year
	function unitGuideViewButton(unitCode, tpCode, tpYear) {
		return {
			href:
				unitguideBaseUrl +
				'view?unitCode=' +
				unitCode +
				'&tpCode=' +
				getOfficialTeachingPeriod(tpCode) +
				'&tpYear=' +
				tpYear,
			text: unitCode + ' Unit Guide'
		};
	}

	function buildUnitGuideSearchButton() {
		return {
			href: unitguideBaseUrl + 'refine?' + unitguideSearchQuery,
			text: 'Search Unit Guides'
		};
	}

	function getOfficialTeachingPeriod(tp) {
		return tpDictonary[tp];
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
		loginfo: function() {
			console.log('Unit =');
			console.log(unit);
			console.log('User =');
			console.log(user);
			console.log('Offering =');
			console.log(offering);
			console.log('Callista =');
			console.log(callista);
			console.log('Requirements:');
			console.log(buttonsRequirement);
		},
		healthCheck: function() {
			if (!user.email) {
				console.error('@MS: Logged in User Block is not added, hence email can not be retrieved!');
			}
		},
		setMoodlePowerUsers: function(emialArray) {
			if (Array.isArray(emialArray)) {
				return emialArray;
			} else {
				return powerUsers;
			}
		},
		addStudentPortal: function() {
			// add IT Student Portal
			if (unit.teachingFaculty === 'FIT') {
				var portalUrl = unitMode === 'Campus' ? buildCourseViewURL('38028') : buildCourseViewURL('24532');
				addButtonToElem(htmlDivId, buttonStyle, portalUrl, 'IT Student Portal');
			}
		},
		addMyGrades: function() {
			// add My Grades
			if (unit.gradeUrl) {
				addButtonToElem(htmlDivId, buttonStyle, unit.gradeUrl, 'My Grades');
			}
		},
		addUnitGuides: function() {
			// add Unit Guide buttons
			if (!buttonReq.unitGuide) {
				addButtonToElem(htmlDivId, buttonStyle, buildUnitGuideSearchButton, 'Search Unit Guides');
				return;
			}

			// Generating Unit Guide link
			if (teachingPeriods.length > 1) {
				if (unitCodes.length === 1) {
					// Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
					var { href, text } = buildUnitGuideViewButton(
						offering.unitCodes[0],
						offering.teachingPeriodBlock,
						offering.year
					);
					addButtonToElem(htmlDivId, buttonStyle, href, text);
				} else {
					// If there is a complex situation (i.e., Multiple Unit Codes or Teaching Periods)
					// RULE: take first unit with first teaching period and last unit with last teaching period
					var unitGuide = buildUnitGuideViewButton(
						offering.unitCodes[0],
						offering.teachingPeriods[0],
						offering.year
					);
					addButtonToElem(htmlDivId, buttonStyle, unitGuide.href, unitGuide.text);

					// Year needs to be adjusted if the second part of teaching period block is S1. Beacuse the S1 will be the year after.
					if (offering.teachingPeriods[1] === 'S1') offering.year = parseInt(offering.year) + 1;
					var { hred, text } = buildUnitGuideViewButton(
						offering.unitCodes[offering.unitCodes.length - 1],
						offering.teachingPeriods[1],
						offering.year
					);
					addButtonToElem(htmlDivId, buttonStyle, href, text);
				}
			} else {
				// Handling normal cases including S2-S1-02 teaching period
				for (var i = 0; i < unitCodes.length; i++) {
					var unitGuide = buildUnitGuideViewButton(unitCodes[i], teachingPeriods[0], year);
					addButtonToElem(htmlDivId, buttonStyle, unitGuide.href, unitGuide.text);
				}
			}
		}
	};
})();
