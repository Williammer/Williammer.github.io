/*
	object-oriented javascript to create an ecosystem, in the form of :
	
			##########
			#		 #
			#	o	##
			#o		##
			# o		 #
			##########
	
*/
// get file
(function(){
	
	//functions
	function forEach(arr, callback){	//---------------------> #add context, border-check
		for(var i =0; i<arr.length; i++){
			callback(arr[i]);
		}
	}
	
	function map(arr, callback) {
		var res = [];
		forEach(arr, function(el){
			res.push(callback(el));
		});
		return res;
	}
	
	function bind(func, object) {
		return function(){
			return func.apply(object, arguments);
		};
	}
	
	function method(object, name) {
		return function() {
			object[name].apply(object, arguments);
		};
	}
	
	function forEachIn(object, action) {	//iterate object property
		for (var property in object) {
			if (object.hasOwnProperty(property))
			action(property, object[property]);
		}
	}
	
	function dom(name, attributes /*, children...*/) {
		var node = document.createElement(name);
		if (attributes) {
			forEachIn(attributes, function(name, value) {
				node.setAttribute(name, value);
			});
		}
		for (var i = 2; i < arguments.length; i++) {	// for deep dom creation
			var child = arguments[i];
			if (typeof child == "string")
			child = document.createTextNode(child);
			node.appendChild(child);
		}
		return node;
	}
	
	var output = dom("div", {id: "printOutput"});
	
	console.dir(output);
	function print() {
		var result = [];
		forEach(arguments, function(arg){result.push(String(arg));});
		output.appendChild(dom("pre", null, result.join("")));
	}
	
	function asArray(quasiArray, start) {
		var result = [];
		for (var i = (start || 0); i < quasiArray.length; i++)
		result.push(quasiArray[i]);
		return result;
	}

	function partial(func) {
		var fixedArgs = asArray(arguments, 1);
		return function(){
			return func.apply(null, fixedArgs.concat(asArray(arguments)));
		};
	}
	function randomElement(array) {
		if (array.length == 0)
		throw new Error("The array is empty.");
		return array[Math.floor(Math.random() * array.length)];
	}
	/* function inPlacePrinter() {
		var div = __ENV.parent.DIV();
		var first = true;
		__ENV.output(div);
		return function(text) {
			text = String(text);
			if (__ENV.parent.preNewline != "\n")
				text = text.replace(/\n/g, __ENV.parent.preNewline);
				__ENV.parent.replaceChildNodes(div, __ENV.parent.document.createTextNode(String(text)));
			if (first) {
				__ENV.parent.scrollToBottom(div.parentNode.parentNode);
				first = false;
			}
		};
	} */
	function elementFromCharacter(character) {
		if (character == " ")
		return undefined;
		else if (character == "#")
		return wall;
		else if (creatureTypes.contains(character))
		return new (creatureTypes.lookup(character))();
		else
		throw new Error("Unknown character: " + character);
	}
	
	function characterFromElement(element) {
		if (element == undefined)
		return " ";
		else
		return element.character;
	}
	
	//#return a new instantiated object;
	function clone(object) {
		function OneShotConstructor(){}
		OneShotConstructor.prototype = object;
		return new OneShotConstructor();
	}
	//set up the OO structure.
	//basic Class: Point(x, y), Tank(width, height), Bug()
	
	function Point(x, y){
		this.x = x;
		this.y = y;
		//return this.x+', '+this.y;
	}
	Point.prototype.add = function(custom){
		return new Point(this.x+custom.x, this.y+custom.y);
	}
	
	function Tank(width, height){
		this.width = width;
		this.height = height;
		this.cell = new Array(this.width* this.height);
	}
	
	Tank.prototype.getElement = function(point){
		return this.cell[point.x+ this.width*point.y];
	};
	
	Tank.prototype.setElement = function(point, el){
		this.cell[point.x+ this.width*point.y] = el;
	};
	
	Tank.prototype.rmElement = function(point){
		this.cell[point.x+ this.width*point.y] = undefined;
	};
	
	Tank.prototype.moveElement = function(from, to){
		this.setElement(to, this.getElement(from));
		this.setElement(from, undefined);
	};
	
	Tank.prototype.isInside = function(point){
		return (point.x>=0 & point.y>=0 & point.x<this.width & point.y<this.height);
	};
	
	Tank.prototype.hasPoint = function(el){
		return (this.getElement(el.pos) === el.character);
	};
	
	Tank.prototype.each = function(action) {
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var point = new Point(x, y);
				action(point, this.getElement(point));
			}
		}
	};
	
	function Terrarium(plan) {
		var grid = new Tank(plan[0].length, plan.length);
		for (var y = 0; y < plan.length; y++) {
			var line = plan[y];
			for (var x = 0; x < line.length; x++) {
				grid.setElement(new Point(x, y), elementFromCharacter(line.charAt(x)));
			}
		}
		this.grid = grid;
	}
	
	
	Terrarium.prototype.toString = function() {
		var characters = [];
		var endOfLine = this.grid.width - 1;
		this.grid.each(function(point, value) {
			characters.push(characterFromElement(value));
			if (point.x == endOfLine)
			characters.push("\n");
		});
		return characters.join("");
	};
	
	Terrarium.prototype.listActingCreatures = function() {
		var found = [];
		this.grid.each(function(point, value) {
			if (value != undefined && value.act)
			found.push({object: value, point: point});
		});
		return found;
	};
	
	Terrarium.prototype.listSurroundings = function(center) {
		var result = {};
		var grid = this.grid;
		directions.each(function(name, direction) {
		var place = center.add(direction);
		if (grid.isInside(place))
		result[name] = characterFromElement(grid.getElement(place));
		else
		result[name] = "#";
		});
		return result;
	};
	
	Terrarium.prototype.processCreature = function(creature) {//--------------> suspicious
		var action = creature.object.act(this.listSurroundings(creature.point));
		if (action.type == "move" && directions.contains(action.direction)) {
			var to = creature.point.add(directions.lookup(action.direction));
			if (this.grid.isInside(to) && this.grid.getElement(to) == undefined)
			this.grid.moveElement(creature.point, to);
		}
		else {
			throw new Error("Unsupported action: " + action.type);
		}
	};
	
	Terrarium.prototype.step = function() {
		forEach(this.listActingCreatures(), bind(this.processCreature, this));
		if (this.onStep)
			this.onStep();		
	};
	
	Terrarium.prototype.start = function() {
		if (!this.running)
		this.running = setInterval(bind(this.step, this), 500);
	};

	Terrarium.prototype.stop = function() {
		if (this.running) {
			clearInterval(this.running);
			this.running = null;
		}
	};
	
	function Dictionary(startValues) {
		this.values = startValues || {};
	}
	Dictionary.prototype.store = function(name, value) {
		this.values[name] = value;
	};
	Dictionary.prototype.lookup = function(name) {
		return this.values[name];
	};
	Dictionary.prototype.contains = function(name) {
		return Object.prototype.propertyIsEnumerable.call(this.values, name);
	};
	Dictionary.prototype.each = function(action) {
		forEachIn(this.values, action);
	};
	Dictionary.prototype.names = function() {
		var names = [];
		this.each(function(name, value) {names.push(name);});
		return names;
	};
	
	var creatureTypes = new Dictionary();
	creatureTypes.register = function(constructor) {
		this.store(constructor.prototype.character, constructor);
	};
	
	var wall = {};
	wall.character = "#";
	
	function Bug(){
		//this.pos = pos;		//---------------> is it safe to do it this way? what if the argument is not in the expected form?
	}
	Bug.prototype.act = function(surroundings) {
		return {type: "move", direction: "c"};
	};
	Bug.prototype.character = 'o';
	
	function BouncingBug() {
	  this.direction = "ne";
	}
	BouncingBug.prototype.act = function(surroundings) {
		if (surroundings[this.direction] != " ")
		this.direction = (this.direction == "ne" ? "sw" : "ne");
		return {type: "move", direction: this.direction};
	};
	BouncingBug.prototype.character = "%";

	creatureTypes.register(BouncingBug);
	
	function DrunkBug() {};
	DrunkBug.prototype.act = function(surroundings) {
		return {type: "move",
			direction: randomElement(directions.names())};
	};
	DrunkBug.prototype.character = "~";
	creatureTypes.register(DrunkBug);
	
	function LifeLikeTerrarium(plan) {
		Terrarium.call(this, plan);
	}
	LifeLikeTerrarium.prototype = clone(Terrarium.prototype);
	LifeLikeTerrarium.prototype.constructor = LifeLikeTerrarium;
	
	LifeLikeTerrarium.prototype.processCreature = function(creature) {
	  if (creature.object.energy <= 0) return;
	  var surroundings = this.listSurroundings(creature.point);
	  var action = creature.object.act(surroundings);

	  var target = undefined;
	  var valueAtTarget = undefined;
	  if (action.direction && directions.contains(action.direction)) {
		var direction = directions.lookup(action.direction);
		var maybe = creature.point.add(direction);
		if (this.grid.isInside(maybe)) {
		  target = maybe;
		  valueAtTarget = this.grid.getElement(target);
		}
	  }

	  if (action.type == "move") {
		if (target && !valueAtTarget) {
		  this.grid.moveElement(creature.point, target);
		  creature.point = target;
		  creature.object.energy -= 1;
		}
	  }
	  else if (action.type == "eat") {
		if (valueAtTarget && valueAtTarget.energy) {
		  this.grid.setElement(target, undefined);
		  creature.object.energy += valueAtTarget.energy;
		  valueAtTarget.energy = 0;
		}
	  }
	  else if (action.type == "photosynthese") {
		creature.object.energy += 1;
	  }
	  else if (action.type == "reproduce") {
		if (target && !valueAtTarget) {
		  var species = characterFromElement(creature.object);
		  var baby = elementFromCharacter(species);
		  creature.object.energy -= baby.energy * 2;
		  if (creature.object.energy > 0)
			this.grid.setElement(target, baby);
		}
	  }
	  else if (action.type == "wait") {
		creature.object.energy -= 0.2;
	  }
	  else {
		throw new Error("Unsupported action: " + action.type);
	  }

	  if (creature.object.energy <= 0)
		this.grid.setElement(creature.point, undefined);
	};
	
	function Lichen() {
	  this.energy = 5;
	}
	Lichen.prototype.act = function(surroundings) {
	  var emptySpace = findDirections(surroundings, " ");
	  if (this.energy >= 13 && emptySpace.length > 0)
		return {type: "reproduce", direction: randomElement(emptySpace)};
	  else if (this.energy < 20)
		return {type: "photosynthese"};
	  else
		return {type: "wait"};
	};
	Lichen.prototype.character = "*";

	creatureTypes.register(Lichen);

	function findDirections(surroundings, wanted) {
	  var found = [];
	  directions.each(function(name) {
		if (surroundings[name] == wanted)
		  found.push(name);
	  });
	  return found;
	}
	
	function LichenEater() {
	  this.energy = 10;
	}
	LichenEater.prototype.act = function(surroundings) {
	  var emptySpace = findDirections(surroundings, " ");
	  var lichen = findDirections(surroundings, "*");

	  if (this.energy >= 30 && emptySpace.length > 0)
		return {type: "reproduce", direction: randomElement(emptySpace)};
	  else if (lichen.length > 1)
		return {type: "eat", direction: randomElement(lichen)};
	  else if (emptySpace.length > 0)
		return {type: "move", direction: randomElement(emptySpace)};
	  else
		return {type: "wait"};
	};
	LichenEater.prototype.character = "c";

	creatureTypes.register(LichenEater);

	function CleverLichenEater() {
	  this.energy = 10;
	  this.direction = "ne";
	}
	CleverLichenEater.prototype.act = function(surroundings) {
	  var emptySpace = findDirections(surroundings, " ");
	  var lichen = findDirections(surroundings, "*");

	  if (this.energy >= 30 && emptySpace.length > 0) {
		return {type: "reproduce",
				direction: randomElement(emptySpace)};
	  }
	  else if (lichen.length > 1) {
		return {type: "eat",
				direction: randomElement(lichen)};
	  }
	  else if (emptySpace.length > 0) {
		if (surroundings[this.direction] != " ")
		  this.direction = randomElement(emptySpace);
		return {type: "move",
				direction: this.direction};
	  }
	  else {
		return {type: "wait"};
	  }
	};
	CleverLichenEater.prototype.character = "c";

	creatureTypes.register(CleverLichenEater);
	var directions = new Dictionary(
		{"c": new Point( 0, 0),
		"n": new Point( 0, -1),
		"ne": new Point( 1, -1),
		"e": new Point( 1, 0),
		"se": new Point( 1, 1),
		"s": new Point( 0, 1),
		"sw": new Point(-1, 1),
		"w": new Point(-1, 0),
		"nw": new Point(-1, -1)}
	);
		
	function show(x){
		var show = "";
		for (var y = 0; y < arguments.length; y++) {
			show += arguments[y];      
		}
		// console.log(show);
		
		container.innerHTML = show;
	}

	var showTerrarium = function(obj){
		show(obj);

		return function() {
			// console.clear();
			// if(document.body.children(container))
			 container.innerHTML ='';
			showTerrarium(obj);
			
		}  
	};	
	
	var thePlan =
		["############################",
		"# # #   o               #  #",
		"#                          #",
		"# #####                    #",
		"## #                   # ###",
		"### ##                    ##",
		"# ### #                    #",
		"# ####                     #",
		"# ##                      o#",
		"#                 o # o ####",
		"#                        # #",
		"############################"];
		
	var newPlan =
		["############################",
		"#                      #####",
		"#    ##                 ####",
		"#   ####     ~ ~          ##",
		"#    ##       ~            #",
		"#                          #",
		"#                ###       #",
		"#               #####      #",
		"#                ###       #",
		"# %        ###        %    #",
		"#        #######           #",
		"############################"];
	
	var lichenPlan =
		["############################",
		"#                     ######",
		"#    ***                **##",
		"#   *##**         **  c  *##",
		"#    ***     c    ##**    *#",
		"#       c         ##***   *#",
		"#                 ##**    *#",
		"#   c       #*            *#",
		"#*          #**       c   *#",
		"#***        ##**    c    **#",
		"#*****     ###***       *###",
		"############################"];
	
	var container = dom('pre', {id:'container'});
	document.body.appendChild(container);
	
	var terrarium = new LifeLikeTerrarium(lichenPlan);
	terrarium.onStep = partial(showTerrarium(terrarium), terrarium);	//--------------> find an alternative to display terrarium in DOM
	terrarium.start();
	
	// console.dir(document.body);
	
})();