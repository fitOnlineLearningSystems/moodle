/**
* FUNCTION
* @module FITMOODLE
*/

var FITMOODLE = (function() {
	var MoodleBaseUrl, unitguideBaseUrl, unitguideSearchQuery, queryToBypassRestriction;

	var tpDictonary = {};

	var powerUsers = [];
	/**
  * Search curent URL and returns value given the query string (in url)
	* @function getQueryVariable
	* @param variable {string}
	* @returns {string} value pair (if found) or null (if not found)
	*/
	function getQueryString(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return null;
	}

	/**
  * Loop through object and return Error if any object is null
	* @function consolePassOrFail
	* @param text Information about the user.
  * @param object The name of the user
  */
	function consolePassOrFail(text, object) {
		!Object.values(object).every((o) => o === null)
			? console.log('%c PASS ', 'color: white; background-color: #95B46A', text, object)
			: console.log('%c FAIL ', 'color: white; background-color: #D33F49', text, object);
	}

	/**
 * 
 * @class Unit
 */
	const Unit = new function() {
		this.shortname = document.querySelector('span.media-body')
			? document.querySelector('span.media-body').innerText
			: null;
		this.id = getQueryString('id') || 'Not a Moodle unit';
		this.gradeUrl = document.querySelector("a[data-key='grades']")
			? document.querySelector("a[data-key='grades']").getAttribute('href')
			: null;
	}();

	consolePassOrFail('@MS: Unit =', Unit);

	/**
	 * @class User
	 */
	const User = new function() {
		this.queryToBypassRestriction = '';
		this.email = document.querySelector('.myprofileitem.email')
			? document.querySelector('.myprofileitem.email').innerText.toLowerCase()
			: null;
		thisfullName = document.querySelector('.myprofileitem.fullname')
			? document.querySelector('.myprofileitem.fullname').innerText
			: null;
		this.hasEditingAccess = document.querySelector("a[href*='&edit=']") ? true : false;
		this.turnedEditingOn = document.querySelector('body.editing') ? true : false;
		this.hasPowerUserAccess =
			powerUsers.includes(this.email) || document.URL.indexOf(this.queryToBypassRestriction) > 0 ? true : false;
	}();
	consolePassOrFail('@MS: User =', User);

	/**
	 * @class Callista
	 */
	const Callista = new function() {
		this.nodelist = document.querySelectorAll('section.block_callista div.card-text a[onclick]');
		this.noCallista = document.querySelector('section.block_callista p');
		this.attachmet =
			this.nodelist.length > 0 ? [ ...this.nodelist ].map((x) => x.innerText) : this.noCallista.innerText;
	}();
	consolePassOrFail('@MS: Callista =', Callista);

	/**
	 * @class Offering
	 */
	var Offering = new function() {
		this.shortnameBlocks = Unit.shortname.split('_');
		this.unitCodes = this.shortnameBlocks[0].split('-'); // Handling multiple unit codes and teaching periods (e.g., FITXXXX-FITYYYY, S1-S2)
		this.teachingPeriodBlock = this.shortnameBlocks[1];
		this.teachingPeriods = this.teachingPeriodBlock.split('-');
		this.campus = this.shortnameBlocks.length > 3 ? shortnameBlocks[2].split('-') : 'One for all campuses';
		this.year = this.shortnameBlocks[this.shortnameBlocks.length - 1].split('-');
		this.taughtByFIT = this.unitCodes[0].indexOf('FIT') >= 0 ? true : false;
		this.monashOnline = this.teachingPeriods[0].indexOf('MO-TP') > 0 ? true : false;
	}();
	consolePassOrFail('@MS: Offering =', Offering);

	/**
	 * Returns url and text for Moodle Student Portal, given Moodle unit id
	 * @function studentPortalButton
	 * @param {string} idQueryString
	 * @returns {object}
	*/
	function studentPortalButton(idQueryString) {
		if (Unit.id) {
			return {
				elementHref: MoodleBaseUrl + '/course/view.php?id=' + idQueryString,
				elementText: 'IT Student Portal'
			};
		} else {
			return {
				elementHref: MoodleBaseUrl,
				elementText: 'Moodle Dashboard'
			};
		}
	}

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
					'/view?unitCode=' +
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
  * @param userInfo Information about the user.
  * @param userInfo.name The name of the user.
  * @param userInfo.email The email of the user.
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

	/** @lends FITMOODLE */
	return {
		/**
		 * Sets url base (e.g., "https://lms.monash.edu"). WARN: do not put slash (/) at the end
		 * @public
		 * @function setMoodleBaseUrl
		 * @param {string} url 
		 * @return {this} this, chainable
		 */
		setMoodleBaseUrl: function(urlString) {
			if (typeof urlString === 'string' || urlString instanceof String) MoodleBaseUrl = urlString;
			consolePassOrFail('@MS: Moodle Base Url set to', MoodleBaseUrl);
			return this;
		},
		/**
		 * @function setUnitGuideBaseUrl 
		 * Sets url base (e.g., "https://lms.monash.edu"). WARN: do not put slash (/) at the end
		 * @public
		 * @param {string} url 
		 * @return {this} this, chainable
		 */
		setUnitGuideBaseUrl: function(url) {
			if (typeof url === 'string' || url instanceof String) unitGuideBaseUrl = url;
			consolePassOrFail('@MS: Unit Guide Base Url =', unitGuideBaseUrl);
			return this;
		},
		/**
		 * @function setUnitGuideSearchUrl
		 * Sets url base (e.g., "https://unitguidemanager.monash.edu"). WARN: do not put slash (/) at the end
		 * @public
		 * @param {string} url 
		 * @return {this} this, chainable
		 */
		setUnitGuideSearchUrl: function(url) {
			if (typeof url === 'string' || url instanceof String) unitguideSearchQuery = url;
			consolePassOrFail('@MS: Unit Guide Search Query =', unitguideSearchQuery);
			return this;
		},
		/**
		 * @function setTeachingPeriodsDictionary
		 * Sets a value pair for converting shorten teaching periods to official teaching periods (e.g., "{'S1':'S1-01'}").
		 * @public
		 * @param {string} url 
		 * @return {this} this, chainable
		 */
		setTeachingPeriodsDictionary: function(obj) {
			if (typeof obj === 'object' || obj instanceof Object) tpDictonary = obj;
			consolePassOrFail('@MS: Teaching Period Dictionary =', tpDictonary);
			return this;
		},
		/**
		 * @function setMoodlePowerUsers
		 * Sets list (e.g., "https://lms.monash.edu"). WARN: do not put slash (/) at the end
		 * @public
		 * @param {string} url 
		 * @return {this} this, chainable
		 */
		setMoodlePowerUsers: function(emialArray) {
			if (Array.isArray(emialArray)) powerUsers = emialArray;
			consolePassOrFail('@MS: Power Users =', powerUsers);
			return this;
		},
		/**
		 * @function setqueryToBypassRestriction
		 * Sets url base (e.g., "https://lms.monash.edu"). WARN: do not put slash (/) at the end
		 * @public
		 * @param {string} url 
		 * @return {this} this, chainable
		 */
		setqueryToBypassRestriction: function(queryString) {
			if (typeof queryString === 'string' || queryString instanceof String)
				this.queryToBypassRestriction = queryString;
			consolePassOrFail('@MS: Bypass Query set as "', queryString, '"');
			return this;
		},
		/**
		 * @function addStudentPortal
		 * Adds a button pointing to IT Student Portal
		 * @public
		 * @return {this} this, chainable
		 */
		addStudentPortal: function() {
			// add IT Student Portal
			if (Offering.taughtByFIT) {
				var btn = Offering.monashOnline ? studentPortalButton('24532') : studentPortalButton('38028');
				addButtonToQuickLink(btn);
			}
			consolePassOrFail('@MS: Student Portal =', btn);
			return this;
		},
		/**
		 * Adds a button pointing to IT Student Portal
		 * Executes if gradebook is visible to students (i.e., Edit Settings > Appearance > Show gradebook to students)
		 * @function addMyGrades
		 * @public
		 * @return {this} this, chainable
		 */
		addMyGrades: function() {
			// add My Grades
			if (Unit.gradeUrl) {
				addButtonToQuickLink({
					elementHref: Unit.gradeUrl,
					elementText: 'My Grades'
				});
			}
			return this;
		},
		/**
		 * Add a button (or button) pointing to Unit Guides
		 * Executes if a Callista is being attached and the unit shortname starts with a unit code (i.e., 3 letters followed by 4 digits)
		 * @function addUnitGuide
		 * @public
		 * @return {this} this, chainable
		 * @memberof class:FITMOODLE
		 */
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
			} else {
				addButtonToQuickLink(unitGuideButton());
			}
			return this;
		},
		/**	 
		 * Add a button pointing to IT Student Portal
		 * Executes if gradebook is visible to students (i.e., Edit Settings > Appearance > Show gradebook to students)
		 * @function addTurnEditingButton
		 * @memberof class:FITMOODLE 
		 */
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
							email: User.email,
							name: User.fullName,
							subject: "Moodle issue in '" + Unit.shortname + ' (URL: ' + window.location + ')',
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
		addCarousel: function(parentElementId, carouselId, carouselClass, carouselInterval, courselObjectArray) {
			var courselInner = '';
			for (var i = 0; i < courselObjectArray.length; i++) {
				courselInner +=
					(i == 0 ? "<div class='carousel-item active'>" : "<div class='carousel-item'>") +
					'<a href=' +
					courselObjectArray[i].href +
					"target='_blank'> <img class='d-block w-100'" +
					'src=' +
					courselObjectArray[i].src +
					' alt=' +
					courselObjectArray[i].alt +
					' /> </a> </div>';
			}
			document.getElementById(parentElementId).innerHTML +=
				'<div id=' +
				carouselId +
				'class=' +
				carouselClass +
				"data-ride='carousel' data-interval=" +
				carouselInterval +
				"> <div class='carousel-inner'> " +
				courselInner +
				'</div> </div>';

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
		/**
     * Replace
     * @return {string} Console Log whether function is successfully executed (Passed) or thrown error (Error).
     */
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
