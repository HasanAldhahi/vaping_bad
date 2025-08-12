var npc = {

	fish: {
		select: function() {
			var fish = $('#fish, #fish_click_area');
			return fish;
		},
		
		click_area: function() {
				if (!$('#fish_click_area').length) {
				$('<div/>', {
					id: 'fish_click_area'
				})
						.appendTo('#floor');
			}
		},
	
		swim: function() {
			console.log("DEBUG: swim() function has been called."); // Debugging line
			if ($.inArray("disappear", fish) === -1) {
				// Initiate spritely 
				$(npc.fish.select()).sprite({
					fps: 8,
					no_of_frames: 5
				});
	
				npc.fish.click_area();
				npc.fish.move();
				npc.fish.react();

				// hide key
				$('#key').hide();
			
			} else {
				$(npc.fish.select()).remove();
				npc.fish.key();
			}
		},
		
		move: function(repeat) {     
				var fish = $('#fish');

				if (!repeat) {
				fish.spState(2); // Start with the second row of sprites
				} else {
					fish.spToggle().fps(8).spState(2);
			}

			// Defines the movement loop
			var movement = function(item) {
				// New coordinates for room.html
				var new_pos_1 = { left: 500, top: 150 };
				var new_pos_2 = { left: 100, top: 300 };

				item
					.animate(new_pos_1, 8000, 'linear', function() {
						item.spState(1); // Change to the first row of sprites to "turn" left
					})
					.animate(new_pos_2, 8000, 'linear', function() {
						if (!window.test) {
							item.spState(2); // Change back to the second row to "turn" right
							movement(item); // Repeat the movement
						}
					});
			};

			// Animate both the fish and its invisible click area
			movement(fish);
			movement($('#fish_click_area'));
		},
		
		// Updated react function for picture viewing and vaping quiz
		react: function() {
			$(npc.fish.select()).off('click.npcfish').on('click.npcfish', function() {
				room.the_player.go_to.start({
					target: '2-15', // a position near the fish in the room
					action: function() {
						$(room.player_body()).css('background-position', '-310px 0px');
						npc.fish.move_to_player($('#fish'), true);
						npc.fish.move_to_player($('#fish_click_area'));
						room.center(true, 100);

						// Check if user has viewed the picture
						var viewedPicture = $.jStorage.get('viewed_picture', false);
						var watchedVideo = $.jStorage.get('watched_video', false);
						var completedQuiz = $.jStorage.get('completed_vaping_quiz', false);

						if (!viewedPicture) {
							// User hasn't looked at the picture yet
						dialogue_box.display({
								character: 'Fish',
								picture: 'aquarium_fish_big.png',
								text: 'Hello! Before we can proceed, you need to examine the picture on the wall. Go click on it first, then come back to me.',
								options: ['Okay, I\'ll check the picture']
							});

							$('#options').off('click').on('click', 'li', function() {
							dialogue_box.destroy();
							npc.fish.move(true);
						});
						} else if (!watchedVideo) {
							// User viewed picture but hasn't watched video yet
							dialogue_box.display({
								character: 'Fish',
								picture: 'aquarium_fish_big.png',
								text: 'Great! You\'ve looked at the picture. Now you need to watch the educational video about vaping health effects. Click on the picture again to watch it, then come back to me for a quiz.',
								options: ['I\'ll watch the video first']
							});

							$('#options').off('click').on('click', 'li', function() {
								dialogue_box.destroy();
								npc.fish.move(true);
							});
						} else if (!completedQuiz) {
							// User has watched video, now present the health quiz
							dialogue_box.display({
								character: 'Fish',
								picture: 'aquarium_fish_big.png',
								text: 'Perfect! I see you\'ve watched the educational video. Now let\'s test what you learned with a short quiz about vaping health effects.',
								options: ['I\'m ready for the quiz']
							});

							$('#options').off('click').on('click', 'li', function() {
								dialogue_box.destroy();
								npc.fish.startVapingQuiz();
							});
						} else {
							// Quiz completed, unlock corridor
									dialogue_box.display({
								character: 'Fish',
								picture: 'aquarium_fish_big.png',
								text: 'Excellent! You\'ve completed the health education. The corridor is now unlocked. You can proceed to the next area.',
								options: ['Thank you!']
							});

							$('#options').off('click').on('click', 'li', function() {
										dialogue_box.destroy();
										npc.fish.move(true);
								// Enable corridor access
								$('#door_exit').removeClass('locked').addClass('unlocked');
							});
						}
					}
									});
								});
		},

		startVapingQuiz: function() {
			console.log("DEBUG: startVapingQuiz function called!");
			var quiz = {
				"question1": {
					"question": "What is the one common oral health issue associated with frequent vaping? HINT: think about what happens when your mouth is exposed to heat and chemicals frequently.",
					"options": ["Strengthening of the tooth surface", "Dry mouth", "Increased saliva production"],
					"answer": "Dry mouth"
				},
				"question2": {
					"question": "How does vaping impact gum health over time? HINT: consider how nicotine and chemicals might affect blood flow and tissue repair.",
					"options": ["It promotes gum regeneration", "It reduces inflammation in the gums", "It increases the risk of gum disease"],
					"answer": "It increases the risk of gum disease"
				},
				"question3": {
					"question": "Which of the following is a potential visible effect of vaping on the mouth? HINT: think about how vapor residues and chemicals could interact with the outer layer of your teeth.",
					"options": ["Whiter tooth surfaces", "Tooth staining", "No visible effects"],
					"answer": "Tooth staining"
				}
			};

			var currentQuestion = "question1";

			function displayQuestion() {
				var questionData = quiz[currentQuestion];
									dialogue_box.display({
					character: 'Fish',
					picture: 'aquarium_fish_big.png',
					text: questionData.question,
					options: questionData.options
				});

				// Add quiz-specific class to options after dialogue is rendered
				setTimeout(function() {
					$('#options li').addClass('quiz-option');
				}, 100);

				// Use event delegation specifically for quiz options
				$('body').off('click.quiz').on('click.quiz', '#options li.quiz-option', function(e) {
					console.log("Quiz option clicked:", $(this).text());
					var selectedOption = $(this).text();
					if (selectedOption === questionData.answer) {
						// Award 100 coins for correct answer
						window.awardCoins(100);
						
						// Play absorbing sound for correct answer
						sound_absorbing.play();
						
						dialogue_box.display({
							character: 'Fish',
							text: 'Correct! Great job understanding the health effects. +100 coins!',
							options: ['Next Question']
						});
						// Clean up quiz events and classes
						$('body').off('click.quiz');
						$('#options li').removeClass('quiz-option');
						
						$('#options').off('click').on('click', 'li', function() {
							if (currentQuestion === "question1") {
								currentQuestion = "question2";
								displayQuestion();
							} else if (currentQuestion === "question2") {
								currentQuestion = "question3";
								displayQuestion();
							} else {
								// Quiz completed - clean up quiz events
								$('body').off('click.quiz');
								$('#options li').removeClass('quiz-option');
								
								// Play beep sound for quiz completion
								sound_beep.play();
								
								dialogue_box.display({
									character: 'Fish',
									text: 'Excellent! You\'ve successfully completed the health education quiz. You now understand the important health effects of vaping.',
									options: ['Finish']
								});
								$('#options').off('click').on('click', 'li', function() {
									dialogue_box.destroy();
									npc.fish.move(true);
									
									// Mark quiz as completed and unlock corridor
									$.jStorage.set('completed_vaping_quiz', true);
									$('#door_exit').removeClass('locked').addClass('unlocked');
									
									console.log("DEBUG: Quiz completed! Corridor should be unlocked.");
									console.log("DEBUG: completed_vaping_quiz set to:", $.jStorage.get('completed_vaping_quiz'));
									
									// Show corridor unlock message
									setTimeout(function() {
										$('#player').text_cloud('The corridor door is now unlocked!', 3000);
									}, 500);
									
									// Trigger void merge effect if health was lost
									if (window.currentHealth < 100) {
										setTimeout(function() {
											scene.void_merge_effect();
										}, 1000);
							}
						});
					}
				});
					} else {
						// Penalize health by 2% for wrong answer
						window.penalizeHealth(2);
						
						// Clean up quiz events and classes
						$('body').off('click.quiz');
						$('#options li').removeClass('quiz-option');
						
						dialogue_box.display({
							character: 'Fish',
							text: 'Not quite right. Think about the hint and try again. -2% health!',
							options: ['Try Again']
						});
						$('#options').off('click').on('click', 'li', function() {
							displayQuestion();
						});
					}
				});
			}

			displayQuestion();
		},
		
		move_to_player: function(item, spritely) {
			if (spritely) item.spToggle();
			item
			.stop(true)
			.animate({
				left:98, 
				top:-190
			}, 200)
			.css('background-position','0 0'); 
		},
		
		key: function() {
			//take the key
			$('#aquarium').find('#key').click(function () {
				room.the_player.go_to.start({
					target: '18-5',
					action: function() {
						items.take('#key');
						$('#teleport, #exit').show('slow'); 
					}  
				});
			})
			$('#key').fadeIn();
		}
	// fish - END
	},

	furnace: {
		furnace_use: function() {var select = $('#furnace_use'); return select},
		furnace: function() {var select = $('#furnace'); return select},
		body: function() {var select = $('#body'); return select},
		eyes: function() {var select = $('#left_eye, #right_eye'); return select},
		mouth: function() {var select = $('#mouth'); return select},
		fire: function() {var select = $('.fire'); return select},
		burn: function () {
			var fire = npc.furnace.fire();
			function burn() {
				fire
				.animate({opacity:.8}, 200)
				.animate({opacity:.6}, 250)
				.animate({opacity:.85}, 200)
				.animate({opacity:.65}, 100)
				.animate({opacity:.9}, 150)
				.animate({opacity:.65}, 200, function() {
					burn();
				})
			}
			burn();
		},
		has_food: function() {
			if ( $.inArray("twig", collected) !== -1 && $.inArray("twig", used) === -1) {
				dialogue_box.display({
					character:false,
					picture:false,
					text: 'The furnace wants to eat a twig',
					options: ['Ok', 'No!']
				}, 'big');

				$('#options').on('click', '#option_0', function() {
					setTimeout(function() {
						items.use('#twig');
						$('#option_0').click(function() {
							dialogue_box.destroy();
							scene.no_click(true);
							setTimeout(function() {
								npc.furnace.furnace().text_cloud('Nom, nom, nom.', 750);
								npc.furnace.is_eating();
							}, 500);
						});
					}, 500);
				});
			} else if ( $.inArray("note", collected) !== -1 && $.inArray("note", used) === -1 && $.inArray("scene_keypad", played) === -1) {
				dialogue_box.display({
					character:false,
					picture:false,
					text: 'The furnace wants to eat your note. You may need it later – maybe you should write it down?',
					options: ['Give a note.', 'Keep a note to yourself.']
				}, 'big');

				$('#options').on('click', '#option_0', function() {
					setTimeout(function() {
						items.use('#note');
						$('#option_0').click(function() {
							dialogue_box.destroy();
							scene.no_click(true);
							setTimeout(function() {
								npc.furnace.furnace().text_cloud('Nom, nom, nom.', 750);
								npc.furnace.is_eating();
							}, 500);
						});
					}, 500);
				});
			} else if ($.inArray("note", collected) !== -1 && $.inArray("note", used) === -1) {
				dialogue_box.display({
					character:false,
					picture:false,
					text: 'The furnace want\'s to eat your note.',
					options: ['Ok', 'No!']
				}, 'big');

				$('#options').on('click', '#option_0', function() {
					setTimeout(function() {
						items.use('#note');
						$('#option_0').click(function() {
							dialogue_box.destroy();
							scene.no_click(true);
							setTimeout(function() {
								npc.furnace.furnace().text_cloud('Nom, nom, nom.', 750);
								npc.furnace.is_eating();
							}, 500);
						});
					}, 500);
				});
			} else if ( $.inArray("coal", collected) !== -1 && $.inArray("coal", used) === -1) {
				dialogue_box.display({
					character:false,
					picture:false,
					text: 'The furnace want\'s to eat a coal.',
					options: ['Ok', 'No!']
				}, 'big');

				$('#options').on('click', '#option_0', function() {
					setTimeout(function() {
						items.use('#coal');
						$('#option_0').click(function() {
							dialogue_box.destroy();
							scene.no_click(true);
							setTimeout(function() {
								npc.furnace.furnace().text_cloud('Nom, nom, nom.', 750);
								npc.furnace.is_eating();
							}, 500);
						});
					}, 500);
				});
			}
			$('#options').on('click', '#option_1', function() {
				dialogue_box.destroy();
			});
		},
		is_eating: function() {
			var mouth = npc.furnace.mouth(),
				eyes = npc.furnace.eyes(),
				is_fed = function() {
					setTimeout(function() {
							if ($.inArray("coal", used) === -1 || $.inArray("twig", used) === -1 || $.inArray("note", used) === -1) {
								if (!Modernizr.csstransitions) {
									mouth
									.animate({top:'-=80'}, 250)
									.animate({top:'+=80'}, 100, function() {
										sound_clong.play();
									})
								} else {
									mouth
									.transition({top:'-=80'}, 250)
									.transition({top:'+=80'}, 100, function() {
										sound_clong.play();
									})
								}
								npc.furnace.furnace().text_cloud('I want more!', 1000);
								scene.no_click(false);
							} else {
								npc.furnace.is_strong();
							}
						}, 500);
					};
			eyes
			.animate({opacity:.5}, 375)
			.animate({opacity:0}, 375);
			if (!Modernizr.csstransitions) {
				mouth
				.animate({top:'-=80'}, 250)
				.animate({top:'+=80'}, 100, function() {
					sound_clang.play();
				})
				.animate({top:'-=80'}, 100)
				.animate({top:'+=80'}, 100, function() {
					sound_clang.play();
				})
				.animate({top:'-=80'}, 100)
				.animate({top:'+=80'}, 100, function() {
					sound_clang.play();
					is_fed();
				});
			} else {
				mouth
				.transition({top:'-=80'}, 250)
				.transition({top:'+=80'}, 100, function() {
					sound_clang.play();
				})
				.transition({top:'-=80'}, 100)
				.transition({top:'+=80'}, 100, function() {
					sound_clang.play();
				})
				.transition({top:'-=80'}, 100)
				.transition({top:'+=80'}, 100, function() {
					sound_clang.play();
					is_fed();
				});
			}
		},
		is_strong: function() {
			var furnace = npc.furnace.furnace(),
				body 	= npc.furnace.body(),
				eyes 	= npc.furnace.eyes(),
				mouth 	= npc.furnace.mouth(),
				fire 	= npc.furnace.fire();
			
			furnace.text_cloud('YEAH!', 2000);
			mouth.attr('style', '');

			if (!Modernizr.csstransitions) {
				body.css({rotate: 'rotate(0deg)'});
				body
				.animate({top:15}, 500, function() {
					sound_screech.play();
				})
				.animate({top:-3}, 100)
				.delay(300)
				.animate({top:15}, 100)
				.animate({top:0}, 500);
			} else {
				body
				.transition({top:15, rotate:0}, 500, function() {
					sound_screech.play();
				})
				.transition({top:-3}, 100)
				.transition({top:15, delay:300}, 100)
				.transition({top:0}, 500);
			}

			furnace
			.delay(600)
			.animate({top:'-=20'}, 200)
			.animate({top:'+=20'}, 100, function() {
				sound_clang.play();
			});
			mouth
			.animate({top:515-80}, 700)
			.animate({top:515}, 200)
			.animate({top:515-20}, 100)
			.animate({top:515}, 100, function() {
				scene.no_click(false);
				sound_clong.play();
				soundManager.resume('boiler_room');
				furnace.text_cloud('Thank you man!', 2000);
				setTimeout(function() {
					furnace.text_cloud('Check your room! Things have changed!', 2000);
				}, 3000)
				npc.furnace.burn();
				npc.furnace.random_moves();
				//add information that scene has been played
				var get_played = $.jStorage.get('played');
				get_played.push('scene_furnace');
				$.jStorage.set('played', get_played);
				npc.furnace.furnace_use().remove();
			});

		//is_strong - END
		},
		is_weak: function() {
			var furnace = npc.furnace.furnace(),
				body 	= npc.furnace.body(),
				eyes 	= npc.furnace.eyes(),
				mouth 	= npc.furnace.mouth(),
				fire 	= npc.furnace.fire();
			
			scene.no_click(true);
			if ($.inArray("twig", used) === -1) {
				furnace.text_cloud('I\'m weak...', 2000);
			} else if ($.inArray("note", used) === -1) {
				furnace.text_cloud('Help me please...', 2000);
			} else if ($.inArray("coal", used) === -1) {
				furnace.text_cloud('Still hungry...', 2000);
			}

			fire
			.animate({opacity:.5}, 1700)
			.animate({opacity:0}, 300, function() {
				scene.no_click(false);
				npc.furnace.has_food();
			});

			sound_screech.play();

			if (!Modernizr.csstransitions) {
				body
				.animate({top:5,rotate: 1}, 1700)
				.animate({top:10, rotate: -.5}, 100)
				.animate({top:7}, 50)
				.animate({top:10}, 50)
				.animate({top:8}, 50)
				.animate({top:10}, 50);
				mouth
				.animate({top:'-=10'}, 1700)
				.animate({top:'+=10'}, 100, function() {
					sound_clong.play();
				})
				.animate({top:'-=7'}, 50)
				.animate({top:'+=7'}, 50)
				.animate({top:'-=5'}, 50)
				.animate({top:'+=5'}, 50, function() {
					sound_clang.play();
				});
			} else {
				body
				.transition({top:5, rotate: 1}, 1700)
				.transition({top:10, rotate: -.5}, 100)
				.transition({top:7}, 50)
				.transition({top:10}, 50)
				.transition({top:8}, 50)
				.transition({top:10}, 50);
				mouth
				.transition({top:'-=10'}, 1700)
				.transition({top:'+=10'}, 100, function() {
					sound_clong.play();
				})
				.transition({top:'-=7'}, 50)
				.transition({top:'+=7'}, 50)
				.transition({top:'-=5'}, 50)
				.transition({top:'+=5'}, 50, function() {
					sound_clang.play();
				});
			}
		//is_weak - END
		},
		random_moves: function() {
			var body = npc.furnace.body();
			window.timer = setInterval(function() {
				var random = Math.random() * 1;
				if (random > .5) {
					body
					.transition({rotate: .5}, 500)
					.transition({rotate: 1}, 200)
					.transition({rotate: -.5}, 500)
					.transition({rotate: -2}, 200)
						.transition({rotate: .5}, 500)
						.transition({rotate: 1}, 200)
						.transition({rotate: -.5}, 500)
						.transition({rotate: -2}, 200)
					.transition({rotate: 0}, 300);
				} else {
					body
					.transition({top: '-=5', rotate: 1}, 500)
					.transition({top: '+=20'}, 200)
					.transition({top: '-=15', rotate: -2}, 500)
					.transition({top: '+=5'}, 500)
					.transition({top: '-=5', rotate: 0}, 500);
				}
			}, (Math.random() * 8 + 6)*1000);
		}
	// furnace - END
	}

// npc - END
}