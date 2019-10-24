/**
 * This library conatins all properties and methods to enhance Moodle capabailities at Monash Instance
 * @author Milad Sayad <milad.sayad@monash.edu>
 * @class
 */
var FITMOODLE = (function() {
	// test
	// @param {string} id
	var MoodleBaseUrl,
		unitguideBaseUrl,
		unitguideSearchQuery,
		tpDictonary,
		powerUsers = [],
		queryToBypassRestriction;

	/**
	* Returns value given the query string (in url)
  * @constructs user
	* @param {string} id
	* @returns {object}
 * @memberof module:FITMOODLE
	*/
	var getQueryVariable = function(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return false;
	};

	/**
 * Returns url and text for Moodle Student Portal, given Moodle unit id
 * @param {string} id
 * @returns {object}
 * @protected
 */
	var moodlePortalButton = function(id) {
		if (id) {
			return {
				elementHref: MoodleBaseUrl + '/course/view.php?id=' + id,
				elementText: 'IT Student Portal'
			};
		} else {
			return {
				elementHref: MoodleBaseUrl,
				elementText: 'Moodle Dashboard'
			};
		}
	};

	/**
 * Returns url and text for Moodle Student Portal, given Unit Code, Teaching Period, and Year
 * @param {string} id
 * @returns {object}
 * @protected
 */
	var unitGuideButton = function(unitCode, tpCode, tpYear) {
		if (unitCode && tpCode && tpYear) {
			return {
				elementHref:
					unitguideBaseUrl +
					'view?unitCode=' +
					unitCode +
					'&tpCode=' +
					tpDictonary[tpCode] +
					'&tpYear=' +
					tpYear,
				elementText: unitCode + ' Unit Guide'
			};
		} else {
			return {
				elementHref: unitguideBaseUrl + 'refine?' + unitguideSearchQuery,
				elementText: 'Search Unit Guides'
			};
		}
	};

	/**
 * Add a button
 * @param {string} id
 * @returns {object}
 * @protected
 */
	function addButtonToQuickLink({ elementHref, elementText }) {
		const parentElementId = 'QuickLink',
			elementClass = 'btn btn-link btn-sm btn-block quick-link-button';

		document.getElementById(parentElementId).innerHTML +=
			'<a class="' +
			elementClass +
			'" href="' +
			elementHref +
			'" role="button" target="_blank">' +
			elementText +
			'</a>';
	}
	/**
     * Blend two colors together.
     * @param {string} color1 - The first color, in hexadecimal format.
     * @param {string} color2 - The second color, in hexadecimal format.
     * @return {string} The blended color.
     */
	function consolePassOrFail(text, object) {
		!Object.values(object).every((o) => o === null)
			? console.log('%c PASS ', 'color: white; background-color: #95B46A', text, object)
			: console.log('%c FAIL ', 'color: white; background-color: #D33F49', text, object);
	}

	// Scraped & Dependent variables
	const unit = new function() {
		this.shortname = document.querySelector('span.media-body')
			? document.querySelector('span.media-body').innerText
			: null;
		this.id = getQueryVariable('id') ? getQueryVariable('id') : 'Not a Moodle unit';
		this.gradeUrl = document.querySelector("a[data-key='grades']")
			? document.querySelector("a[data-key='grades']").getAttribute('href')
			: null;
	}();
	consolePassOrFail('@MS: Unit =', unit);

	const User = new function() {
		this.email = document.querySelector('.myprofileitem.email')
			? document.querySelector('.myprofileitem.email').innerText.toLowerCase()
			: null;
		thisfullName = document.querySelector('.myprofileitem.fullname')
			? document.querySelector('.myprofileitem.fullname').innerText
			: null;
		this.hasEditingAccess = document.querySelector("a[href*='&edit=']") ? true : false;
		this.turnedEditingOn = document.querySelector('body.editing') ? true : false;
		this.hasPowerUserAccess =
			powerUsers.includes(this.email) || document.URL.indexOf(queryToBypassRestriction) > 0 ? true : false;
	}();

	consolePassOrFail('@MS: User =', User);

	const Callista = new function() {
		this.nodelist = document.querySelectorAll('section.block_callista div.card-text a[onclick]');
		this.noCallista = document.querySelector('section.block_callista p');
		this.attachmet = this.nodelist.length > 0 ? [ ...this.nodelist ].map((x) => x.innerText) : this.noCallista.innerText;
	}();
	consolePassOrFail('@MS: Callista =', Callista);

	var Offering = new function() {
		this.shortnameBlocks = unit.shortname.split('_');
		this.unitCodes = this.shortnameBlocks[0].split('-'); // Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
		this.teachingPeriodBlock = this.shortnameBlocks[1];
		this.teachingPeriods = this.teachingPeriodBlock.split('-');
		this.campus = this.shortnameBlocks.length > 3 ? shortnameBlocks[2].split('-') : 'One for all campuses';
		this.year = this.shortnameBlocks[this.shortnameBlocks.length - 1].split('-');
		this.taughtByFIT = this.unitCodes[0].indexOf('FIT') > 0 ? true : false;
		this.monashOnline = this.teachingPeriods[0].indexOf('MO-TP') > 0 ? true : false;
	}();
	consolePassOrFail('@MS: Offering =', Offering);
	/**
 * The methods are available to all.
 * @public
 * @class
 */
	return {
		setMoodleBaseUrl: function(url) {
			if (typeof url === 'string' || url instanceof String) this.MoodleBaseUrl = url;
			consolePassOrFail('@MS: Moodle Base Url =', this.MoodleBaseUrl);
			return this;
		},
		setUnitGuideBaseUrl: function(url) {
			if (typeof url === 'string' || url instanceof String) this.unitGuideBaseUrl = url;
			consolePassOrFail('@MS: Unit Guide Base Url =', this.unitGuideBaseUrl);
			return this;
		},
		setUnitGuideSearchUrl: function(url) {
			if (typeof url === 'string' || url instanceof String) this.unitguideSearchQuery = url;
			consolePassOrFail('@MS: Unit Guide Search Query =', this.unitguideSearchQuery);
			return this;
		},
		setMoodlePowerUsers: function(emialArray) {
			if (Array.isArray(emialArray)) powerUsers = emialArray;
			consolePassOrFail('@MS: Power Users =', powerUsers);
			return this;
		},
		setqueryToBypassRestriction: function(queryString) {
			if (typeof queryString === 'string' || queryString instanceof String)
				this.queryToBypassRestriction = queryString;
			return this;
		},
		addStudentPortal: function() {
			// add IT Student Portal
			if (Offering.taughtByFIT === 'FIT') {
				addButtonToQuickLink(
					Offering.location === 'Campus' ? moodlePortalButton('38028') : moodlePortalButton('24532')
				);
			}
			consolePassOrFail('@MS: Student Portal =');
			return this;
		},
		addMyGrades: function() {
			// add My Grades
			if (unit.gradeUrl) {
				addButtonToQuickLink({
					elementHref: unit.gradeUrl,
					elementText: 'My Grades'
				});
			}
			return this;
		},
		addUnitGuide: function() {
			if (Offering.unitCodes[0].match(/\w{3}\d{4}/g) && Callista.nodelist.length > 1) {
				// Generating Unit Guide link
				if (Offering.teachingPeriods.length > 1) {
					if (offerng.unitCodes.length === 1) {
						// Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
						addButtonToQuickLink(
							unitGuideButton(Offering.unitCodes[0], Offering.teachingPeriodBlock, Offering.year)
						);
					} else {
						// If there is a complex situation (i.e., Multiple Unit Codes or Teaching Periods)
						// RULE: take first unit with first teaching period and last unit with last teaching period
						addButtonToQuickLink(
							unitGuideButton(Offering.unitCodes[0], Offering.teachingPeriods[0], Offering.year)
						);

						// Year needs to be adjusted if the second part of teaching period block is S1. Beacuse the S1 will be the year after.
						if (Offering.teachingPeriods[1] === 'S1') Offering.year = parseInt(Offering.year) + 1;
						addButtonToQuickLink(
							unitGuideButton(
								Offering.unitCodes[Offering.unitCodes.length - 1],
								Offering.teachingPeriods[1],
								Offering.year
							)
						);
					}
				} else {
					// Handling normal cases including S2-S1-02 teaching period
					for (var i = 0; i < Offering.unitCodes.length; i++) {
						addButtonToQuickLink(
							unitGuideButton(Offering.unitCodes[i], Offering.teachingPeriods[0], Offering.year)
						);
					}
				}
			}
			return this;
		},
		addTurnEditingButton: function() {
			// Target the turn editing on/off menu item
			var menu = $('.context-header-settings-menu a[href*="edit=o"]');

			if (menu.length) {
				console.log('@GB: menu = ', menu);
				var html = $(menu).html();

				// set different button themes for editing on or off
				if (html.indexOf('Turn editing on') >= 0) {
					var state = 'btn-primary';
				} else {
					var state = 'btn-success';
				}
				console.log('@GB: html = ', html);
				var href = $(menu).attr('href');
				console.log('@GB: href = ', href);
				var btn =
					'<a class="btn ' + state + '" id="edit-on-off" href="' + href + '"><span>' + html + '</span></a>';
				console.log('@GB: btn = ', btn);

				// Add button before breadcrumbs
				$('#page-navbar').before(btn);
			}
			return this;
		},
		addSupportBee: function() {
			// Add 'Contact support', but only if editing is on
			if ($('body.editing').length > 0) {
				// Load external script
				$.getScript('//d3932137p5ikt7.cloudfront.net/widget_v3/loader.min.js')
					.done(function(script, textStatus) {
						sb_contact_form('initialize', {
							company: 'fit-monash',
							height: '500px',
							position: 'bottom',
							email: user.email,
							name: user.fullName,
							subject: "Moodle issue in '" + unit.shortname + ' (URL: ' + window.location + ')',
							locale: 'en',
							captcha: 'false',
							forwarding_address_id: '26544'
						});
					})
					.fail(function(jqxhr, settings, exception) {
						console.log('@GB: exception = ', exception);
						console.log('@GB: settings = ', settings);
					});
			}
			return this;
		},
		addBackToTop: function() {
			if ($('#back-to-top').length) {
				var scrollTrigger = 100, // px
					backToTop = function() {
						var scrollTop = $(window).scrollTop();
						if (scrollTop > scrollTrigger) {
							$('#back-to-top').addClass('show');
						} else {
							$('#back-to-top').removeClass('show');
						}
					};
				backToTop();
				$(window).on('scroll', function() {
					backToTop();
				});
				$('#back-to-top').on('click', function(e) {
					e.preventDefault();
					$('html,body').animate(
						{
							scrollTop: 0
						},
						700
					);
				});
			}
			return this;
		},
		limitUnitMainPage: function() {
			if (window.location.href.indexOf('view.php?id=') > 0 && $('body.editing').length > 0) {
				$("a[title='Set or change image']").css('display', 'none');
				$("a[title='Edit summary']").css('display', 'none');
				$("a[title='Move this section out of the grid']").css('display', 'none');
				$('a.add-sections').css('display', 'none');
				$("i[aria-label='Hide HTML block']").parent().hide();
				$("i[aria-label='Hide Panopto block']").parent().hide();
				$("i[aria-label='Hide Logged in user block']").parent().hide();
			}
			return this;
		},
		limitOtherUsers: function() {
			if (window.location.href.indexOf('enrol/otherusers.php?id=') > 0) {
				$("button[type='submit']").css('display', 'none');
				$('a.assignrolelink').css('display', 'none');
			}
			return this;
		},
		changeDefaultImport: function() {
			if (window.location.href.indexOf('backup/import.php') > 0) {
				$("input[type='checkbox']").prop('checked', false);
				$('input#id_setting_root_activities').prop('checked', true);
			}
			return this;
		},
		changeNewActivityIcon: function() {
			$('img.new_activity').attr(
				'src',
				'https://lms.monash.edu/draftfile.php/3075058/user/draft/44115094/New-Activity.png'
			);
			return this;
		},
		/**
     * Hide left-column blocks in pages (e.g., assignmnet and gradebook) to free up space for the iframe .
     * @return {string} Console Log whether function is successfully executed (Passed) or thrown error (Error).
     */
		hideRightBlocks: function() {
			if (
				(window.location.href.indexOf('action=grading') > 0 &&
					window.location.href.indexOf('mod/assign/view.php') > 0) ||
				window.location.href.indexOf('/grade/report/history/index.php') > 0 ||
				window.location.href.indexOf('grade/report/grader/index.php') > 0
			) {
				$("section[data-region='blocks-column']").hide();
				$('section#region-main').removeClass('has-blocks');
			}
			return this;
		}
	};
})();
