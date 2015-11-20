export module helper {

	export class MathHelper {
		public static gcf(a, b) {
			return ( b == 0 ) ? (a):( this.gcf(b, a % b) );
		}

		public static lcm_nums(originalArray) {
			var ar = originalArray.slice(0);
			if (ar.length > 1) {
				ar.push( this.lcm( ar.shift() , ar.shift() ) );
				return this.lcm_nums( ar );
			} else {
				return ar[0];
			}
		}

		private static lcm(a, b) {
			return ( a / this.gcf(a,b) ) * b;
		}
	}
}