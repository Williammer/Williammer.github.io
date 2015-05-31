function forEachIn(object, action) {	//iterate object property
		for (var property in object) {
			if (object.hasOwnProperty(property))
			action(property, object[property]);
		}
	}


	//#create dom element with javascript, nested dom element supported.
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
	
	//Event #1 registerEvent
	function registerEventHandler(node, event, handler) {
		if (typeof node.addEventListener == "function")
		node.addEventListener(event, handler, false);	//browser concern #1
		else
		node.attachEvent("on" + event, handler);
	}
	function unregisterEventHandler(node, event, handler) {
		if (typeof node.removeEventListener == "function")
		node.removeEventListener(event, handler, false);
		else
		node.detachEvent("on" + event, handler);
	}
	
	//case mouse event:
	/* registerEventHandler(myParagraph, "mouseover", function(event) {
		event = event || window.event;
		if ((event.target || event.srcElement) == myParagraph)//browser concern #3
		print("The mouse has entered my paragraph!");
	});
	//case key event:
	registerEventHandler(document.body, "keypress", function(event) {
		event = event || window.event;
		var charCode = event.charCode || event.keyCode;//browser concern #4
		if (charCode)
		console.log("Character '", String.fromCharCode(charCode), "' was typed.");
	}); 
	//case input event:
	addHandler(textfield, "focus", function(event) {
		event.target.style.backgroundColor = "yellow";
	});
	addHandler(textfield, "blur", function(event) {
		event.target.style.backgroundColor = "";
	});
	addHandler(textfield, "change", function(event) {
		print("Content of text field changed to '", event.target.value, "'.");
	});
	//case window event: onload, scroll, resize
	*/
	
	//Event #2 event object eg. function(event){}
	function normalizeEvent(event) {
		if (!event.stopPropagation) {
			event.stopPropagation = function() {this.cancelBubble = true;};
			event.preventDefault = function() {this.returnValue = false;};
		}
		if (!event.stop)
			event.stop = function() {
				this.stopPropagation();
				this.preventDefault();
			};
		if (event.srcElement && !event.target)
			event.target = event.srcElement;
		if ((event.toElement || event.fromElement) && !event.relatedTarget)
			event.relatedTarget = event.toElement || event.fromElement;
		if (event.clientX != undefined && event.pageX == undefined) {
			event.pageX = event.clientX + document.body.scrollLeft;
			event.pageY = event.clientY + document.body.scrollTop;
		}
		if (event.type == "keypress")
			event.character = String.fromCharCode(event.charCode || event.keyCode);
		return event;
	}
	
	//Event #3 combines #1 and #2
	function addHandler(node, type, handler) {
		function wrapHandler(event) {
			handler(normalizeEvent(event || window.event));	//browser concern #2
		}
		registerEventHandler(node, type, wrapHandler);
		return {node: node, type: type, handler: wrapHandler};
	}
	function removeHandler(object) {
		unregisterEventHandler(object.node, object.type, object.handler);
	}
	
	
	//#Game sokoban - to push a given number of boulders into the exit;
	var levels = [{boulders: 10,
		field: [
		"######  ##### ",
		"#    #  #   # ",
		"# 0  #### 0 # ",
		"# 0 @    0  # ",
		"#  #######0 # ",
		"####   ### ###",
		"       #     #",
		"       #0    #",
		"       # 0   #",
		"      ## 0   #",
		"      #*0 0  #",
		"      ########"] },
		{boulders: 10,
		field: [
		"######  ##### ",
		"#    #  #   # ",
		"# 0  #### 0 # ",
		"# 0 @    0  # ",
		"#  #######0 # ",
		"####   ### ###",
		"       #     #",
		"       #0    #",
		"       # 0   #",
		"      ## 0   #",
		"      #*0 0  #",
		"      ########"] },
		{boulders: 10,
		field: [
		"######  ##### ",
		"#    #  #   # ",
		"# 0  #### 0 # ",
		"# 0 @    0  # ",
		"#  #######0 # ",
		"####   ### ###",
		"       #     #",
		"       #0    #",
		"       # 0   #",
		"      ## 0   #",
		"      #*0 0  #",
		"      ########"] }
		];
		
	//Game structure - object-oriented structure : $1. Point; $2. square; $6. Board => (2. Wall; 3. Boulder; 4. Exit; 5. Boy;) 7. Controller => (events; );
	
	/*requirements : 
	1. img. mapping character in field to img;
	2. level. control the game level by certain modifications of the field;
	3. move. push boulder; stop by wall; 
	4. 
	*/	
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
	function Point(x, y){
		this.x = x;
		this.y = y;
		//return this.x+', '+this.y;
	}
	Point.prototype.add = function(custom){
		return new Point(this.x+custom.x, this.y+custom.y);
	}

	function Square(character, img) {
		this.img = img;
		var content = {"@": "player", "#": "wall", "*": "exit",
		" ": "empty", "0": "boulder"}[character];
		if (content == null)
		throw new Error("Unrecognized character: '" + character + "'");
		this.setContent(content);
	}
	Square.prototype.setContent = function(content) {
		this.content = content;
		this.img.src = "images/" + content + ".png";
	}
	
	function SokobanBoard(level) {
		this.fieldDiv = dom("div");
		this.squares = [];
		this.bouldersToGo = level.boulders;
		for (var y = 0; y < level.field.length; y++) {
			var line = level.field[y], squareRow = [];
			for (var x = 0; x < line.length; x++) {
				var img = dom("img");
				this.fieldDiv.appendChild(img);
				squareRow.push(new Square(line.charAt(x), img));
				if (line.charAt(x) == "@")
					this.playerPos = new Point(x, y);
			}
			this.fieldDiv.appendChild(dom("br"));
			this.squares.push(squareRow);
		}
	}
	
	SokobanBoard.prototype.status = function() {
		return this.bouldersToGo + " boulder" +
		(this.bouldersToGo == 1 ? "" : "s") + " to go.";
	};
	SokobanBoard.prototype.won = function() {
		return this.bouldersToGo <= 0;
	};
	
	SokobanBoard.prototype.place = function(where) {
		where.appendChild(this.fieldDiv);
	};
	SokobanBoard.prototype.remove = function() {
		this.fieldDiv.parentNode.removeChild(this.fieldDiv);
	};
	
	//handler
	SokobanBoard.prototype.move = function(direction) {
		var playerSquare = this.squares[this.playerPos.y][this.playerPos.x],
		targetPos = this.playerPos.add(direction),
		targetSquare = this.squares[targetPos.y][targetPos.x];
		// First, see if the player can push a boulder...
		if (targetSquare.content == "boulder") {
			var pushPos = targetPos.add(direction),
			pushSquare = this.squares[pushPos.y][pushPos.x];
			if (pushSquare.content == "empty") {
				targetSquare.setContent("empty");
				pushSquare.setContent("boulder");
			}
			else if (pushSquare.content == "exit") {
				targetSquare.setContent("empty");
				this.bouldersToGo--;
			}
		}
		// Then, try to move...
		if (targetSquare.content == "empty") {
			playerSquare.setContent("empty");
			targetSquare.setContent("player");
			this.playerPos = targetPos;
		}
	};
	
	
	function method(object, name) {
		return function() {
			object[name].apply(object, arguments);
		};
	}
	
	function SokobanGame(levels, place) {
		this.levels = levels;
		var newGame = dom("BUTTON", null, "New game");
		addHandler(newGame, "click", method(this, "newGame"));
		var reset = dom("BUTTON", null, "Reset level");
		addHandler(reset, "click", method(this, "resetLevel"));
		this.status = dom("DIV");
		this.container = dom("DIV", null, dom("H1", null, "Sokoban"),
		dom("DIV", null, newGame, " ", reset), this.status);
		place.appendChild(this.container);
		addHandler(document, "keydown", method(this, "keyDown"));
		this.newGame();
	}
	SokobanGame.prototype.newGame = function() {
		this.level = 0;
		this.resetLevel();
	};
	SokobanGame.prototype.resetLevel = function() {
		if (this.field)
		this.field.remove();
		this.field = new SokobanBoard(this.levels[this.level]);
		this.field.place(this.container);
		this.updateStatus();
	};
	SokobanGame.prototype.updateStatus = function() {
		this.status.innerHTML = "Level " + (1 + this.level) + ": " +
		this.field.status();
	};
	var arrowKeyCodes = {
		37: new Point(-1, 0), // left
		38: new Point(0, -1), // up
		39: new Point(1, 0), // right
		40: new Point(0, 1) // down
	};
	
	SokobanGame.prototype.keyDown = function(event) {
		if (arrowKeyCodes.hasOwnProperty(event.keyCode)) {
			event.stop();
			
			this.field.move(arrowKeyCodes[event.keyCode]);
			this.updateStatus();
			if (this.field.won()) {
				if (this.level < this.levels.length - 1) {
					alert("Excellent! Going to the next level.");
					this.level++;
					this.resetLevel();
				} else {
					alert("You win! Game over.");
					this.newGame();
				}
			}
		}
	};
	
	// (new SokobanBoard(level)).place(document.body);
	new SokobanGame(levels, document.body);
	