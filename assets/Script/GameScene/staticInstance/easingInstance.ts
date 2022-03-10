export class Easing {
	// https://forum.cocos.org/t/typescript/93014
	public static easingTs() {
		let random: number = Math.floor(Math.random() * 29);
		let ani: string = null;
		switch(random) {
			case 0: 
				ani = "quadIn";
				break;
			case 1:
				ani = "quadOut";
				break;
			case 2:
				ani = "quadInOut";
				break;
			case 3:
				ani = "cubicIn";
				break;
			case 4:
				ani = "cubicOut";
				break;
			case 5:
				ani = "cubicInOut";
				break;
			case 6:
				ani = "quartIn";
				break;
			case 7:
				ani = "quartOut";
				break;
			case 8:
				ani = "quartInOut";
				break;
			case 9:
				ani = "sineIn";
				break;
			case 10:
				ani = "sineOut";
				break;
			case 11:
				ani = "sineInOut";
				break;
			case 12:
				ani = "expoIn";
				break;
			case 13:
				ani = "expoOut";
				break;
			case 14:
				ani = "expoInOut";
				break;
			case 15:
				ani = "circIn";
				break;
			case 16:
				ani = "circOut";
				break;
			case 17:
				ani = "circInOut";
				break;
			// case 18:
			// 	ani = "elasticIn";
			// 	break;
			// case 19:
			// 	ani = "elasticOut";
			// 	break;
			// case 20:
			// 	ani = "elasticInOut";
			// 	break;
			case 18:
				ani = "backIn";
				break;
			case 19:
				ani = "backOut";
				break;
			case 20:
				ani = "backInOut";
				break;
			case 21:
				ani = "bounceIn";
				break;
			case 22:
				ani = "bounceOut";
				break;
			case 23:
				ani = "bounceInOut";
				break;
			case 24:
				ani = "smooth";
				break;
			case 25:
				ani = "fade";
				break;
			case 26:
				ani = "quintIn";
				break;
			case 27:
				ani = "quintOut";
				break;
			case 28:
				ani = "quintInOut";
				break;
			default:
				ani = "";
				break;
		}
		
		return ani;
	}
}
