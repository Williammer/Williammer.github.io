/*
	test case: file.txt;
	
*/
// get file
(function(){
//	var text_src = "% The Book of Programming\n\n%% The Two Aspects\n\nBelow the surface of the machine, the program moves. Without effort, it expands and contracts. In great harmony, electrons scatter and regroup. The forms on the monitor are but ripples on the water. The essence stays invisibly below. \n\nFu-Tzu had written a small program that was full of global state and dubious shortcuts. Reading it, a student asked 'You warned us against these techniques, yet I find them in your program. How can this be?' Fu-Tzu said, 'There is no need to fetch a water hose when the house is not on fire.'{This is not to be read as an encouragement of sloppy programming, but rather as a warning against neurotic adherence to rules of thumb.}";

//get txt file
    function readTextFile(name, callback) {

        var xmlhttp;
        if(window.XMLHttpRequest){
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        try {
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    callback(xmlhttp.responseText);
                }
            };
            xmlhttp.open("GET", name, true);
            xmlhttp.send(null);
        } catch( e ) {
            alert('Caught Exception: ' + e.description);
        }
    }

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

// paragraph processing function
	function filterParagraph(src){
		if(src !== ''){
			var sig_pos = 0;
			while(src.charAt(parseInt(sig_pos)) === '%')
				sig_pos++;
				if(sig_pos > 0)
					return {'type':'h'+parseInt(sig_pos), 'content': splitParagraph(src.slice(parseInt(sig_pos+1))) };	
				 else 
					return {'type':'p', 'content': splitParagraph(src) };
					
		}
	}

	
// filter the strengthened, footnotes in the paragraph;
	function splitParagraph(text) {
		function split() {
			var pos=0, end, fragments = [];
			while(pos < text.length) {
				if (text.charAt(pos) == "*") {
					end = findClosing("*", pos + 1);
					fragments.push({
						type: "strong",
						content: text.slice(pos + 1, end)
					});
					pos = end +1;
					
				} else if (text.charAt(pos) == "{") {
					end = findClosing("}", pos + 1);
					fragments.push({
						type: "footnote",
						content: text.slice(pos + 1, end)
					});
					pos = end +1;
					
				} else {
					end = findOpeningOrEnd(pos);
					fragments.push({
						type: "normal",
						content: text.slice(pos, end)
					});
					pos = end;
				}
			}
			return fragments;
		}

		function findClosing(character, from) {
			var end = text.indexOf(character, from);
			if (end == -1) throw new Error("Missing closing '" + character + "'");
			else return end;
		}

		function findOpeningOrEnd(from) {
			function indexOrEnd(character) {
				var index = text.indexOf(character, from);
				return index == -1 ? text.length : index;
			}
			return Math.min(indexOrEnd("*"), indexOrEnd("{"));

		}
		return split();
	}
	
// extract and put the footnote to the right place;
	function extractFootnotes(paragraphs){
		var footnotes = [], footnoteNum = 0;
		
		function replaceFootnote(fragments){
			if(fragments.type === 'footnote'){
				footnotes.push(fragments);
				footnoteNum++;
				fragments.number = footnoteNum;
				return {'type':'reference', 'number': footnoteNum};
				
			} else {
				return fragments;
			}
		}
		//process each paragraph - replace footnote with its reference;
		forEach(paragraphs, function(para){
			    para.content = map(para.content, replaceFootnote);
		});
		
		return footnotes;
	} 
	
// wrap each part with the right html tag;
	function tag(name, content, attribute){	//level1
		return {'name':name,'content':content,'attribute':attribute  };
	}
	
	function link(target, text){	//level2
		return tag('a', [text], {'href':target});
	}
	
	function htmlDoc(title, body){	//level2
		return tag('html', [ tag('head', [tag('title', title)]), tag('body', body) ]);
	}
	
	function escapeHTML(text){	//level1
		var replaceGroup = [ [/</g, '&lt;'], [/>/g, '&gt;'], [/"/g, '&quot;'], [/&/g, '&amp;'] ];
		forEach(replaceGroup, function(replace){
			text.replace(replace[0], replace[1]);
		});
		
		return text;
	}
	

// output it.
	function outputAttr(attr){
		if(attr == null) return '';
		var res = [];
		for(var name in attr){
			res.push(' '+name+'="'+escapeHTML(attr[name])+'"');	//---------------------> #why attr.name is undefined while attr[name] is not?
		}
		return res.join('');
	}
	
	//abstract level2
	function outputFragment(src){
		//requirement-> process tag  a.reference, a.emph, normal
		if(src.type === 'normal'){
			return src.content;
		} else if(src.type === 'strong'){
			return tag('strong', [src.content]);
		} else if(src.type === 'reference'){
			return tag('sup', [link('#footnote'+src.number, String(src.number))]);
		}
	}
	function outputParagraph(paragraphs){

		function outputEachP(paraOne){
			return tag(paraOne.type, map(paraOne.content, outputFragment));
		}
		return map(paragraphs, outputEachP);
	}
	
	function outputFootnote(footnote){

		function outputOne(footOne){
			return  tag('small', ['['+footOne.number+']',footOne.content], {'id': 'footnote'+footOne.number});
		}
		return map(footnote, outputOne);
	}
	
	function outputHTML(src){
		//string
		var holder = [];
		function output(src){
			if(typeof src === 'string'){
				holder.push(escapeHTML(src));
			} else if(!src.content || src.content.length ===0){
			//empty tag
				 holder.push('<'+src.name+outputAttribute(src.attribute)+'>');

			} else {
			//full tag
                if(src.name === 'small'){
                    holder.push('<'+src.name+outputAttr(src.attribute)+'>');
                    forEach(src.content, output);
                    holder.push('</'+src.name+'><br/>');
                } else {
                    holder.push('<'+src.name+outputAttr(src.attribute)+'>');
                    forEach(src.content, output);
                    holder.push('</'+src.name+'>');
                }
			}
		}
		output(src);
		return holder.join('');
	}
	
	
	function outputFile(file, title){
		var title = 'ajax_supported version';
		//filter one
		var obj_paragraph = map(file.split("\n\n"), filterParagraph);	
		var obj_footnote = extractFootnotes(obj_paragraph);

//		//paragraph
		var html_paragraph = outputParagraph(obj_paragraph);
//
//		//footnote
		var html_footnote = outputFootnote(obj_footnote);
//
//		//html final
		var body = html_paragraph.concat(html_footnote);
		var html = outputHTML(htmlDoc('ajax_supported version', body));

        document.write(html);

	}

	readTextFile('file.txt', outputFile);


})();