<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta property="wb:webmaster" content="edcf77ed05a8765f" />
	<title>William - Advertisement lab</title>
	<meta name="viewport" content="width=device-width, initial-scale=0.33"> 
	<link href="images/favicon.ico" rel="icon" />
	<link href="images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
	<link rel="stylesheet" type="text/css" href="css/preset.css" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
	
<body>	
	<div id="wrapper">
		<input type="button" class="show_ad" value="show_ad" />
		<div class="mod">
			<div class="ad">Advertisement</div>
			<table class="status">
				<tr>
					<td class="td_size_width"></td>
					<td class="td_size_height"></td>
				</tr>
				<tr>
					<td class="td_pos_type"></td>
					<td class="td_pos_top"></td>
					<td class="td_pos_left"></td>
				</tr>
				<tr>
					<td class="td_closable"></td>
				</tr>
				<tr>
					<td class="td_foldable"></td>
				</tr>
				<tr>
					<td class="td_action"></td>
					<td class="td_time"></td>
				</tr>
				
			</table>
		</div>
		
		<div class="demo_ctrl">
			<ul class="ctrl_list">
				<li class="li_size">
					<h4>Size(px)：</h4>
					<label for="size_width">Ad width:<input type="number" id="size_width" onchange="update_width()" /></label>
					<label for="size_height">Ad height:<input type="number" id="size_height" onchange="update_height()" /></label>
				</li>
				<li class="li_pos">
					<h4>Position Type:</h4>
					
					<label for="pos_type_static"><input type="radio" name="pos_type" id="pos_type_static" class="pos_type" value="relative" onclick="update_pos_type(this)" checked />Relative</label>
					<label for="pos_type_abs"><input type="radio" name="pos_type" id="pos_type_abs" class="pos_type" value="absolute" onclick="update_pos_type(this)"  />Absolute</label>
					<label for="pos_type_fixed"><input type="radio" name="pos_type" id="pos_type_fixed" class="pos_type" value="fixed" onclick="update_pos_type(this)" />Fixed
					</label>
					<br/>
					<br/>
					<div class="pos_val_panel">
						<h4>Position(px)：</h4>
						<label for="pos_top">top: <input type="number" id="pos_top" onchange="update_top()"/></label>
						<label for="pos_left">left: <input type="number" id="pos_left" onchange="update_left()"/></label>
					</div>
				</li>
				<li class="li_closable">
					<h4>Closable</h4>
						<label for="closable_y"><input type="radio" name="closable" id="closable_y" class="closable" value="true" onclick="update_closable(this)"  />YES</label>
						<label for="closable_n"><input type="radio" name="closable" id="closable_n" class="closable" value="false" onclick="update_closable(this)" checked />NO</label>
				</li>
				<li class="li_foldable">
					<h4>Foldable：</h4>
					<label for="foldable_y"><input type="radio" name="foldable" id="foldable_y" class="foldable" value="true" onclick="update_foldable(this)" />YES</label>
					<label for="foldable_n"><input type="radio" name="foldable" id="foldable_n" class="foldable" value="false" onclick="update_foldable(this)" checked />NO</label>
				</li>
				<li class="li_time">
					<h4>Timer：</h4>
						<label for="timer_y"><input type="radio" name="timer" id="timer_y" class="closable" value="true" onclick="update_timer(this)"  />YES</label>
						<label for="timer_n"><input type="radio" name="timer" id="timer_n" class="closable" value="false" onclick="update_timer(this)" checked />NO</label>
						<br/>
						<br/>
						<div class="timer_panel">
						<h4>Time(ms)：</h4>
						<label for="time">setTime: <input type="number" id="time" class="setTime" value="1000" onchange="update_time()" /></label>
						</div>
				</li>
			</ul>
		</div>
		<div class="pad_height"></div>
		</div>
	</div>
</body>
</html>

	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="js/script.js"></script>
	

