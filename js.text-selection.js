// JavaScript Document

$(document).ready(function(e) {


	var id = 0;
	
	var text = '',
		selection =  null,
		start = 0,
		end = 0,
		startOffset = 0,
		endOffset = 0,
		startSpan = null,
		endSpan = null;
				
	$.annotation_bar = function(){
		
		var bar = $('<div id="bar"></div>');
		var annotations = $('<select id="annotations"></select>');		
		var option = $('<option value="all">Show all annotations...</option>');
		var note = $('<input type="text" value="" id="note" required="required" placeholder="note"/>');
		var save = $('<input type="button" value="Save" id="save"/>');

		$(save).bind({
			'click':function(e){
				var note_text = $(note).val();
				if(note_text==null || note_text==""){
					alert('Enter a note...');
				} else {
					
					for(i=start;i<=end;i++){
						
						var elem = $('#select-'+i),
							elemText = $(elem).html(),
							selectedText = '',
							tempText = '',
							sO = 0,
							eO = 0,
							tO = 0;
							
						//alert(elemText);
	
						elemText = elemText.replace(/(\r\n|\n|\r)/gm,' ');
						elemText = elemText.replace(/\s+/g,' ');
						selectedText = elemText;
						sO = 0+'<span>'.length;
						eO = selectedText.length;
	
						if(i==start){
							tO=0;
							$(startSpan).attr('name','me');
							tempSpan = $(elem).children('span').first();
							temp = $(tempSpan).attr('name');
							while(temp!='me'){
								
								var temptO = ('<span>'.length)+('</span>'.length);
								if($(tempSpan).hasClass('selected')){
									temptO +=' class="selected"'.length;
								} if ($(tempSpan).attr('name')!=null && $(tempSpan).attr('name')!=undefined) {
									temptO+=(' name=""'.length+$(tempSpan).attr('name').length);
								}
								tO+=($(tempSpan).text().length+temptO);
								//alert(tO+ '  ' +$(tempSpan).text());
								tempSpan=$(tempSpan).next();
								temp=$(tempSpan).attr('name');
							}
							sO = tO+startOffset+'<span>'.length;
							//alert('sO: '+sO + ' = ' + startOffset + ' + ' + tO + ' + ' + ('<span>'.length));
						}
						if(i==end) {
							tO=0;
							$(endSpan).attr('name','me');
							tempSpan = $(elem).children('span').first();
							temp = $(tempSpan).attr('name');
		
							while(temp!='me'){
								
								var temptO = ('<span>'.length)+('</span>'.length);
								if($(tempSpan).hasClass('selected')){
									temptO +=' class="selected"'.length;
								} if ($(tempSpan).attr('name')!=null && $(tempSpan).attr('name')!=undefined) {
									temptO+=(' name=""'.length+$(tempSpan).attr('name').length);
								}
								
								tO+=($(tempSpan).text().length+temptO);
								//alert(tO+ '  ' +$(tempSpan).text());
								tempSpan=$(tempSpan).next();
								temp=$(tempSpan).attr('name');
							}
							eO = tO+endOffset+'<span>'.length;
							//alert('eO: '+eO + ' = ' + endOffset + ' + ' + tO + ' + ' + ('<span>'.length));
						}
						//alert('sO: '+sO+',\r\n eO: '+eO);
	
						selectedText = selectedText.substring(sO, eO);
						//alert(selectedText);
						tempText = '</span><span class="selected" name="annotated-'+id+'">'+selectedText+'</span><span>';
						elemText = elemText.replace(selectedText,tempText);
	
						$(elem).html(elemText);
						
						//alert($(elem).html());
					}
					if(selection.removeAllRange)
						selection.removeAllRange();
					else if(selection.empty)
						selection.empty();
					var option = $('<option value="annotated-'+id+'">'+note_text+'</option>');
					$(annotations).append(option);
					$.set_cookies('annotated-'+id,note_text);
					$(note).val('');
					$('#bar input').fadeOut('fast');
				}
			}
		});
		
		$(annotations).bind({
			'change':function(e){
				var val = $(this).val();
				
				if(val==='all') {
					$('span[name^="annotated"]').removeClass('selected');
					$('span[name^="annotated"]').addClass('selected');					
				} else {
					$('span[name^="annotated"]').removeClass('selected');
					$('span[name="'+val+'"]').addClass('selected');
				}
			}
		});

		$(annotations).append(option);		
		$(bar).addClass('bar');
		$(bar).append(annotations);
		$(bar).append(note);
		$(bar).append(save);
		
		$('html, body').prepend(bar);
	};
	
	$.annotate_text = function(){
		$('#bar input').fadeIn('fast');
	};

	$.get_cookies = function() {
		var cookies=document.cookie.split(";");
		for (var i=0;i<cookies.length;i++) {
	 		name=cookies[i].substr(0,cookies[i].indexOf("-"));
			annote_id=cookies[i].substr(cookies[i].indexOf("-")+1,cookies[i].indexOf("="));
	  		annote_note=cookies[i].substr(cookies[i].indexOf("=")+1);
	  		name=name.replace(/^\s+|\s+$/g,"");
	  		if (name=='annotated') {
				var option = $('<option value="annotated'+annote_id+'">'+unescape(annote_note)+'</option>');
				$('#annotations').append(option);
			}
	  	}
	}

	$.set_cookies = function(annote_id,note) {
		var curd=new Date();
		curd.setDate(curd.getDate() + 1);
		var value=escape(note) + '; expires='+curd.toUTCString();
		document.cookie=annote_id + "=" + value;
	};
	
	$.annotation_bar();
	$.get_cookies();

	var fn_add_ids = function(){
		
		var ids = 1;
		$('p, span').each(function(index, element) {
			
			$(this).attr('id','select-'+ids);
			$(this).attr('target','0');
			var text = $(this).text();
			$(this).empty();
			$(this).append('<span>'+text+'</span>');
			ids++;
        });;
		//alert($('#introduction').html());
	};
	
	fn_add_ids();
	$('#introduction').bind({
		'mousedown':function(e){
			//alert('down');
		},
		'mouseup':function(e){
			
			if (window.getSelection) {
				
				selection =  window.getSelection();
				text = selection.toString();

				start = $(selection.anchorNode).parent().parent().attr('id').split('-')[1];
				startOffset = selection.anchorOffset;
				startSpan = $(selection.anchorNode).parent();
				
				end = $(selection.focusNode).parent().parent().attr('id').split('-')[1];
				endOffset = selection.focusOffset;
				endSpan = $(selection.focusNode).parent();
			} else if (document.selection && document.selection.type != "Control") {
				
				text = document.selection.createRange().text;
			}
			//alert(text);
			
			if($(startSpan).hasClass('selected')||$(endSpan).hasClass('selected')){
				alert('The text you have selected is already annoted.');
				text='';
			}
			
			if(text.length>0){
				
				id++;
				$.annotate_text(id);
			}
		},
		'keypress':function(e){
			e.preventDefault();
			alert(e.which);
		}
	});
	
});