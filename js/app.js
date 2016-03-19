/*  This Pokedex App made by Anton Lempiy as Kottans JS Testing project.
	Application mostly uses pure JS syntax except Jquary blocks for AJAX requests
	and animated scroll mechanics. Author used simple version of MVC (Model View
	Controller) Design Pattern. Dont get angry with understanding this spaghetti code:)*/

/* !!!WARNING!!! My english is very good and I get up early in the morning and do my 
	morning exercises... Please, be tolerant.


/*  Model block used for getting, saving and storing data of application */

var model = {
		/* Making XMLHttpRequest, counting its number. Return saving function to 'close' json info in array, 
			also initializing awesome audio to make user scared of unexpected sound */
		init: function() {
			this.numberOfRequests = 1;
			this.initRequest = $.getJSON('http://pokeapi.co/api/v1/pokemon/?limit=12', function(json) {		
					return model.save(json.objects);
			});
			this.audio = new Audio('http://vignette3.wikia.nocookie.net/pokemon/images/0/05/Pok%C3%A9mon_Theme_Song_%28Gotta_Catch_%27Em_All%29.ogg/revision/latest?cb=20110719233331');
			this.audio.volume = 0.5;
			this.audio.loop = true;
			this.pokedexActived = false;
		},

		/* Saving function saves all pokemon array and current array - list 12 pokemons that were loaded last */
		save: function (arr) {
			this.pokelist = arr;
			this.currentList = this.pokelist;
		},

		/* Function for adding new pokemons to data. Takes a number of previous requests multipies it on 12 pokemons 
		that we need and asigns this value to offset attribute in url of new request. */
		loadMorePokemons: function () {
			var offset = this.numberOfRequests * 12;
			var url = 'http://pokeapi.co/api/v1/pokemon/?limit=12&offset=' + offset;
			this.addingRequest = $.getJSON(url, function(json) {
					return model.addPokemonsToData(json.objects);
			});
			this.numberOfRequests++;
		},

		/* Callback function to store a new request value in our pokelist array */
		addPokemonsToData: function (arr) {
			this.currentList = arr;
			this.pokelist = this.pokelist.concat(arr);
		}
	}

/* Controller block used for conecting data with an application's view */
var controller = {

		/*	Initalizes whole application by runing all starting function from view and model.
			Also insures that rendering will start only after AJAX request was complete.*/
		init: function () {
			model.init();
			listView.loadingRender();
			model.initRequest.complete(function() {
				listView.clearLoadingBox();
				listView.renderAudioBlock();
			 	listView.init();
			 	pokedexView.init();
			 	listView.renderAddButton();
			 	listView.renderSortBlock();
			 	model.audio.play();
			 	listView.renderBonusSection();
			 	pokedexView.scrollHandle();
			});
		},

		/*	Function to allow user adjust sound features */
		controlMusic: function (str) {
			if(str==='-') {
				if(model.audio.volume > 0.1) {
					model.audio.volume = model.audio.volume - 0.1;
				}
			} else if (str==='+') {
				if(model.audio.volume < 0.9) {
					model.audio.volume = model.audio.volume + 0.1;
				}
			} else {
				if(model.audio.paused) {
					model.audio.play();
					listView.reRenderAudioButton('play')
				} else {
					model.audio.pause();					
					listView.reRenderAudioButton('pause')
				}
			}
		},

		/* 	Method that runs an adding new pokemons process. Insures that new elements 
		rendering will start only after new AJAX request was complete. */
		addMorePokemons: function () {
        	model.loadMorePokemons();
        	listView.addButtonLoadingOn();
        	model.addingRequest.complete(function() {
			 	listView.init();
			 	listView.addButtonLoadingOff();
			 	pokedexView.optimizeWindowLayout();
			});
        },

        /*	This method dealing with sort mechanics. The core idea was taken from Devid
        Flanagan's 'JavaScript: The Definitive Guide' book. */
        sortByName: function() {
        	var cardsArr = Array.prototype.slice.call(listView.cards, 0);
		    cardsArr.sort(function(div1, div2) {
		        var val1 = div1.children[1].children[0].innerText;
		        var val2 = div2.children[1].children[0].innerText;
		        if (val1 < val2) return -1;
		        else if (val1 > val2) return 1;
		        else return 0;
		    });
		    for (var i = 0; i < cardsArr.length; i++) {
		        listView.sortRendering(cardsArr[i]);
	    	}
		},

		/*	Similar function that deals with sorting by type of pokemon rather then by name. */
		sortByType: function() {
        	var cardsArr = Array.prototype.slice.call(listView.cards, 0);
		    cardsArr.sort(function(div1, div2) {
		        var val1 = div1.children[1].children[1].textContent;
		        var val2 = div2.children[1].children[1].textContent;
		        if (val1 < val2) return -1;
		        else if (val1 > val2) return 1;
		        else return 0;
		    });
		    for (var i = 0; i < cardsArr.length; i++) {
		        listView.sortRendering(cardsArr[i]);
	    	}
		},

		/*	This method makes a run connection between click event on pokemon card and pokedex rendering.
			It gaves a pokedexView.render() a string with name of pokemon we need. Se more in pokedexView
			section */
        getPokDescr: function (target) {
        	pokedexView.clearBox();
        	pokedexView.render(target);
        },

        /* Returns current pokemon list from model */
        getCurrentPokemonsList: function () {
            return model.currentList;
        },

        /*	Function initalizing a super secret bonus for Kottans tutors*/
        initBonus: function () {
        	bonus.init();
        	$('html, body').animate({
	            	scrollTop: $('canvas').offset().top + 'px'
	        }, 'medium');
        },
        /* Function for switching pokedex activation flag */
        pokedexActive: function () {
        	if(!model.pokedexActived) {
        		model.pokedexActived = true;
        	}
        },
        /* Getter of pokedex state for over View blocks	*/
        getPokedexState: function () {
        	return model.pokedexActived;
        }
	}

/* 	ListView is part view block that deals with rendering left(list) part and top(header) of application. */
var listView = {

		/*  Method bellow initializing a render process for pokemon cards. Takes an array of current
		pokemons array from controller.getCurrentPokemonsList() method and iterates through all its
		components creating unique card for each pokemon. Also adding event listners with closure
		mechanics (solves event-loop troubles) which passes pokemon object as argument to controller.getPokDescr()
		method. Closure function insures that each object will evade 'garbage collection'. */
		init: function () {
            this.list = document.getElementById('list-box');
            controller.getCurrentPokemonsList().forEach(function(pokemon){
	            var newElem = document.createElement('div');
	            var pokemonImg = 'http://pokeapi.co/media/img/' + pokemon.national_id +'.png';
	            newElem.className = "pok-item";
	            newElem.innerHTML = '<div class="img-cont"><img src=' + pokemonImg + '></div><div class="text-cont"><h4>' + pokemon.name + '</h4></div>';
	            listView.list.appendChild(newElem);
	            for(var i = 0; i<pokemon.types.length; i++) {
	            	var type = document.createElement('div');
	            	type.className = "pok-type";
	            	type.id = 'button-'+ pokemon.types[i].name.toLowerCase();
	            	type.textContent = pokemon.types[i].name;
	            	newElem.lastChild.appendChild(type);
	            } 
	            var target = pokemon;
	            newElem.addEventListener('click', (function () {
	                return function () {
	                    controller.getPokDescr(target);
	                };               
              })(target));
            });
			this.cards = document.getElementsByClassName('pok-item');
        },

        /*	Function that renders 'Load More' button. */
        renderAddButton: function () {
        	var buttonBox = document.getElementById('button-box');
        	this.addButton = document.createElement('button');
        	this.addButton.id = 'load-button';
        	this.addButton.textContent = 'Load More';
        	buttonBox.appendChild(this.addButton);
        	this.addButton.addEventListener('click', function () {
	            controller.addMorePokemons();     
            });
        },

        /*	Function that renders a wait dialog with user on starting this page */
        loadingRender: function () {
        	var headerBox = document.getElementById('header-box');
        	headerBox.innerHTML = '<h3>Getting pokemons from pokeballs...</h3><img src="https://media.giphy.com/media/vXa1ndiG1liU0/giphy.gif">'
        },

        /* 	This function simply clears a content of the header. */
        clearLoadingBox: function () {
        	var headerBox = document.getElementById('header-box');
        	headerBox.innerHTML = '';
        },

        /*	Function hides a load button to prevent user from hardclicking multiple requests in 
        a short time. Also renders animation gif to make user know that loading is on its way */
        addButtonLoadingOn: function () {
        	var buttonBox = document.getElementById('button-box');
        	this.addButton.style.display = 'none';
        	this.buttonLoadImg = document.createElement('img');
        	this.buttonLoadImg.src = 'http://25.media.tumblr.com/tumblr_m9a6eqNYze1qfqgb9o1_500.gif';
        	buttonBox.appendChild(this.buttonLoadImg);

        },

        /*	Function that deletes gif animation from previous method and unhides load button */
        addButtonLoadingOff: function () {
        	var buttonBox = document.getElementById('button-box');
        	buttonBox.removeChild(this.buttonLoadImg);
        	this.addButton.style.display = 'inline-block';
        },

        /*	Function for adding Audio adjust panel to the header. */
        renderAudioBlock: function () {
        	var headerBox = document.getElementById('header-box');

        	this.volumeMinusAudio = document.createElement('button');
        	this.switchAudio = document.createElement('button');
        	this.volumePlusAudio = document.createElement('button');

        	this.switchAudio.id = 'switch-audio';
        	this.volumeMinusAudio.id = 'minus-audio';
        	this.volumePlusAudio.id = 'plus-audio';

        	this.switchAudio.innerHTML = '<img src="http://www.clker.com/cliparts/u/M/r/x/C/4/pause-icon-th.png" width="40" height="40">';
        	this.volumeMinusAudio.innerHTML = '<img src="http://www.clker.com/cliparts/5/c/c/0/1194998310719724840edit_remove.svg.thumb.png" width="20">';
        	this.volumePlusAudio.innerHTML = '<img src="http://www.clker.com/cliparts/4/f/9/2/11949983031036191127edit_add.svg.thumb.png" width="20" height="20">';

        	headerBox.appendChild(this.volumeMinusAudio);
        	headerBox.appendChild(this.switchAudio);
        	headerBox.appendChild(this.volumePlusAudio);

        	this.volumeMinusAudio.addEventListener('click', function () {
	            controller.controlMusic('-');     
            });
        	this.switchAudio.addEventListener('click', function () {
	            controller.controlMusic();     
            });
            this.volumePlusAudio.addEventListener('click', function () {
	            controller.controlMusic('+');     
            });
        },

        /*	Method toggles play-pause button view */
        reRenderAudioButton: function (str) {
        	if(str==='play') {
        		this.switchAudio.innerHTML = '<img src="http://www.clker.com/cliparts/u/M/r/x/C/4/pause-icon-th.png" width="40" height="40">';
        	} 
        	if(str==='pause') {
        		this.switchAudio.innerHTML = '<img src="http://www.clker.com/cliparts/u/M/r/x/C/4/play-icon-th.png" width="40" height="40">';
        	}
        },

        /* 	Function adding sort panel to the header */ 
        renderSortBlock: function () {
        	var sortBox = document.getElementById('sort-box');

        	var sortTitle = document.createElement('h4');
        	this.sortName = document.createElement('button');
        	this.sortType = document.createElement('button');

        	sortTitle.textContent = 'Sort cards by:';
        	this.sortName.id = 'sort-name';
        	this.sortType.id = 'sort-type';

        	this.sortName.textContent = 'Name';
        	this.sortType.textContent = 'Type';

        	sortBox.appendChild(sortTitle);
        	sortBox.appendChild(this.sortName);
        	sortBox.appendChild(this.sortType);

        	this.sortName.addEventListener('click', function () {
	            controller.sortByName();     
            });
            this.sortType.addEventListener('click', function () {
	            controller.sortByType();     
            });
        },

        /* simple function that used in controller.sortByType() method. .appendChild specifics 
        insures that element would simply replace in the DOM rather then fully rerender */
        sortRendering: function (elm) {
        	this.list.appendChild(elm);
        },

        /*	Render section and UI for a super secret bonus */
        renderBonusSection: function() {
        	this.bonusBox = document.getElementById('bonus-box');
        	var bonusTitle = document.createElement('h2');
        	this.bonusDescr = document.createElement('h4');
        	this.pokeballImg = document.createElement('img');

        	this.pokeballImg.id = 'bonus-pokeball';
        	this.pokeballImg.src = 'https://i.imgsafe.org/e4edc67.png';

        	bonusTitle.innerHTML = '&bull; Bonus &bull;';
        	this.bonusDescr.textContent = 'Click on pokeball';

        	this.bonusBox.appendChild(bonusTitle);
        	this.bonusBox.appendChild(this.bonusDescr);
        	this.bonusBox.appendChild(this.pokeballImg);

        	this.pokeballImg.addEventListener('click', function () {
        		listView.bonusBox.removeChild(listView.pokeballImg);
        		listView.bonusDescr.textContent = 'Have fun with collecting this image';
	            controller.initBonus();     
            });
        }
        
	}

/*	PokedexView is part view block that deals with rendering right(pokedex) part of application.*/
var pokedexView = {

		/*  Init function declares basic variables. Renders 'press-card' dialog with user. Also making us sure that
			window will displey items corectly after resizing */
		init: function () {
			this.desriptBox = document.getElementById('description-box');

			this.pokedex = document.createElement('div');
			this.pokedex.id='pokedex';

			this.imageWrapper = document.createElement('div');
			this.imageWrapper.id='img-wrapper';

			this.textWrapper = document.createElement('div');
			this.textWrapper.id='text-wrapper';
			
			this.desriptBox.innerHTML = '<img src="http://d.ibtimes.co.uk/en/full/1366391/twitch-plays-pokemon.gif" width="350" height="350"><h2>Press on pokemon card<br>to get pokedex info</h2>';

			window.onresize=function(){
				pokedexView.optimizeWindowLayout();
			};
		},

		/*  Main method for pokedex rendering. Takes an pokemon object as argument (from event listner), 
			uses its data to create a table with switch constr inside loop. Switch checks iteration period and
			creates a specific table row. At the last function handles with our scrolling mechanics. If window width
			is more than 885px it will make pokedex fixed while users window focused inside this pokemons list.
			Otherwise, if window width is less than 885px it creates Jquary animation that focuses user scroll
			bar on pokedex element. That allows user to deal with a very long lists */
		render: function (obj) {
			this.desriptBox.innerHTML='';
			var pokemonImg = 'http://img.pokemondb.net/sprites/black-white/anim/normal/' + (obj.name.toLowerCase()) +'.gif';
			this.imageWrapper.innerHTML = '<img src=' + pokemonImg + ' alt="pokemon-gif">';

			var header = document.createElement('h3');
			header.textContent = obj.name;
			this.textWrapper.appendChild(header);

			var table = document.createElement('table');
			table.className = 'pok-table';
			for(var i = 0; i < 9; i++) {
				var row = document.createElement('tr');
				switch (i) {
						case 0:
						    var desc = document.createElement('td');
						    desc.textContent = 'Type';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.types[0].name;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 1:
						    var desc = document.createElement('td');
						    desc.textContent = 'Attack';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.attack;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 2:
						    var desc = document.createElement('td');
						    desc.textContent = 'Defence';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.defense;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 3:
						    var desc = document.createElement('td');
						    desc.textContent = 'SP Attack';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.sp_atk;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 4:
						    var desc = document.createElement('td');
						    desc.textContent = 'SP Defense';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.sp_def;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 5:
						    var desc = document.createElement('td');
						    desc.textContent = 'Speed';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.speed;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 6:
						    var desc = document.createElement('td');
						    desc.textContent = 'Weight';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.weight;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 7:
						    var desc = document.createElement('td');
						    desc.textContent = 'HP';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.hp;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
						case 8:
						    var desc = document.createElement('td');
						    desc.textContent = 'Total moves';
						    row.appendChild(desc);

						    var val = document.createElement('td');
						    val.textContent = obj.moves.length;
						    val.className = 'table-value';
						    row.appendChild(val);
						    break;
					
					}

				table.appendChild(row);
			}

		this.textWrapper.appendChild(table);

		this.pokedex.appendChild(this.imageWrapper);
		this.pokedex.appendChild(this.textWrapper);

		this.desriptBox.appendChild(this.pokedex);

		controller.pokedexActive();
		this.optimizeWindowLayout();
		
		},

		/*	Simple clear decription box Function*/
		clearBox: function () { 
            this.desriptBox.innerHTML = '';
            this.imageWrapper.innerHTML = '';
			this.textWrapper.innerHTML = '';
        },

        /* This is pokedex element layout optimization function.  */ 
        optimizeWindowLayout: function () {
        	if($(window).width()>885) {
			var styles = {
				justifyContent : "center",
				flexDirection: "row",
			};
			$('#description-box').css(styles);
			pokedexView.pokedexScrolling();
			} else {
				if(document.body.scrollTop>257) {
					$('html, body').animate({
		            	scrollTop: $(this.pokedex).offset().top + 'px'
		        	}, 'medium');
				}
			}
        },

        /* If window width is more than 885px, it changes element style whenever user scrolling inside pokemon list*/
        pokedexScrolling: function(){
        	if($(window).width()>885) {
	        	if(controller.getPokedexState()) {
					var scrollPos = $(document).scrollTop();
					var contentBoxTop = $('#list-box').offset().top;
					var contentBoxBOt = contentBoxTop + $('#list-box').height() - $(this.pokedex).height();
					if(scrollPos>contentBoxTop&&scrollPos<contentBoxBOt) {
						var leftWidth = ($(window).width() / 2) + ($('#description-box').width() / 2 - $(this.pokedex).width() / 2) ;
						var styles = {
							position : "fixed",
							top: "0px",
							left: leftWidth + "px"
						};
						$(this.pokedex).css(styles);
						$('#description-box').css("align-items", "flex-start");
					} else if (scrollPos<contentBoxTop) {
						$(this.pokedex).css("position", "static");
						$('#description-box').css("align-items", "flex-start");
					} else {
						$(this.pokedex).css("position", "static");
						$('#description-box').css("align-items", "flex-end");
					}
				}
			}
		},

		/* Event listener for user scrolling */
		scrollHandle: function () {
 	        $(window).scroll(pokedexView.pokedexScrolling);			
        },
}

/* 	This is a preload module that caching needed images. This part insures that any graphics in the users screen
	will run properly and in time */ 
Resources.load([
        'https://i.imgsafe.org/94626f5.jpg',
        'http://pre07.deviantart.net/bef9/th/pre/f/2012/183/f/b/dexter_the_pokedex_by_jordentually-d55rfva.jpg',
        'http://d.ibtimes.co.uk/en/full/1366391/twitch-plays-pokemon.gif',
        'http://www.clker.com/cliparts/u/M/r/x/C/4/play-icon-th.png',
        'http://www.clker.com/cliparts/u/M/r/x/C/4/pause-icon-th.png',
        'https://media.giphy.com/media/vXa1ndiG1liU0/giphy.gif',
        'http://25.media.tumblr.com/tumblr_m9a6eqNYze1qfqgb9o1_500.gif',
        'https://i.imgsafe.org/67ef161.jpg'
    ]);

/* 	Run application after all resources were loaded */
Resources.onReady(controller.init);

	
