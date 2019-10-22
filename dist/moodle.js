var FITMOODLE = (function() {
	// Defaults variables

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
		unitguideSearchQuery = 'faculty=FACULTY+OF+INFORMATION+TECHNOLOGY';

	var urlParams = new URLSearchParams(new URL(document.URL).search);
	var unit = new function() {
		this.shortname = document.querySelector('span.media-body')
			? document.querySelector('span.media-body').innerText
			: null;
		this.id = urlParams.has('id') ? urlParams.get('id') : 'Not a Moodle unit';
		this.gradeUrl = document.querySelector("a[data-key='grades']")
			? document.querySelector("a[data-key='grades']").getAttribute('href')
			: null;
	}();
	var user = new function() {
		this.email = document.querySelector('.myprofileitem.email')
			? document.querySelector('.myprofileitem.email').innerText.toLowerCase()
			: null;
		this.fullName = document.querySelector('.myprofileitem.fullname')
			? document.querySelector('.myprofileitem.fullname').innerText
			: null;
		this.restriction =
			powerUsers.includes(this.email) || window.location.href.indexOf(avoidRestrictionQuery) > 0 ? false : true; // Returns true if the user is part of list or a specefic query passed
		this.turnedEditingOn = document.querySelector('body.editing') ? true : false;
	}();
	var offering = new function() {
		this.shortnameBlocks = unit.shortname.split('_');
		this.unitCodes = this.shortnameBlocks[0].split('-'); // Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
		this.teachingPeriodBlock = this.shortnameBlocks[1];
		this.teachingPeriods = this.teachingPeriodBlock.split('-');
		this.campus = this.shortnameBlocks.length > 3 ? this.shortnameBlocks[2].split('-') : 'Not Applicable';
		this.year = this.shortnameBlocks[this.shortnameBlocks.length - 1].split('-');
		this.teachingFaculty = this.unitCodes[0].indexOf('MAT') > 0 ? 'Science' : 'FIT';
		this.location = this.teachingPeriods[0].indexOf('MO-TP') > 0 ? 'Monash Online' : 'Campus';
	}();

	var callista = new function() {
		this.nodelist = document.querySelectorAll('section.block_callista div.card-text a[onclick]');
		this.noCallista = document.querySelector('section.block_callista p');
		this.Attachmet =
			this.nodelist.length > 0 ? [ ...this.nodelist ].map((x) => x.innerText) : this.noCallista.innerText;
	}();

	// Specify the condition where a button is required or not
	var buttonRequirement = (function() {
		return {
			unitGuide: offering.unitCodes[0].match(/\w{3}\d{4}/g) && callista.nodelist.length > 1 ? true : false,
			studentPortal: offering.teachingFaculty === 'FIT' ? true : false,
			myGrades: document.querySelector("a[data-key='grades']") ? true : false
		};
	})();

	var moodleViewUrl = function(id) {
		return MoodleBaseUrl + id;
	};

	// returns Unit Guide Button info given Unit Code, Teaching Period, and Year
	var unitGuideViewButton = function(unitCode, tpCode, tpYear) {
		if (unitCode && tpCode && tpYear) {
			return {
				elementHRef:
					unitguideBaseUrl + 'view?unitCode=' + unitCode + '&tpCode=' + tpDictonary[tpCode] + '&tpYear=' + tpYear,
				elementText: unitCode + ' Unit Guide'
			};
		} else {
			return {
				elementHRef: unitguideBaseUrl + 'refine?' + unitguideSearchQuery,
				elementText: 'Search Unit Guides'
			};
		}
	};

	// Add a button
	function addButtonToElement({
		parentElementId = 'ExternalLink',
		elementClass = 'btn btn-link btn-sm btn-block quick-link-button',
		elementHRef,
		elementText
	}) {
		document.getElementById(parentElementId).innerHTML +=
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
		logInfo: function() {
			console.log('Unit =', unit);
			console.log('User =', user);
			console.log('Offering =', offering);
			console.log('Callista =', callista);
			console.log('Requirements:', buttonRequirement);
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
			if (buttonRequirement.studentPortal) {
				addButtonToElement({
					elementHRef: offering.location === 'Campus' ? moodleViewUrl('38028') : moodleViewUrl('24532'),
					elementText: 'IT Student Portal'
				});
			}
		},
		addMyGrades: function() {
			// add My Grades
			if (buttonRequirement.myGrades) {
				addButtonToElement({
					elementHRef: unit.gradeUrl,
					elementText: 'My Grades'
				});
			}
		},
		addUnitGuide: function() {
			// Generating Unit Guide link
			if (offering.teachingPeriods.length > 1) {
				if (offerng.unitCodes.length === 1) {
					// Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
					addButtonToElement(
						unitGuideViewButton(offering.unitCodes[0], offering.teachingPeriodBlock, offering.year)
					);
				} else {
					// If there is a complex situation (i.e., Multiple Unit Codes or Teaching Periods)
					// RULE: take first unit with first teaching period and last unit with last teaching period
					addButtonToElement(
						unitGuideViewButton(offering.unitCodes[0], offering.teachingPeriods[0], offering.year)
					);

					// Year needs to be adjusted if the second part of teaching period block is S1. Beacuse the S1 will be the year after.
					if (offering.teachingPeriods[1] === 'S1') offering.year = parseInt(offering.year) + 1;
					var { hred, text } = buildUnitGuideViewButton();
					addButtonToElement(
						unitGuideViewButton(
							offering.unitCodes[offering.unitCodes.length - 1],
							offering.teachingPeriods[1],
							offering.year
						)
					);
				}
			} else {
				// Handling normal cases including S2-S1-02 teaching period
				for (var i = 0; i < offering.unitCodes.length; i++) {
					addButtonToElement(
						unitGuideViewButton(offering.unitCodes[i], offering.teachingPeriods[0], offering.year)
					);
				}
			}
		}
	};
})();
