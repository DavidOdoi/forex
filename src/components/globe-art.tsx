export function GlobeArt() {
  return (
    <div className="globe-composition" aria-hidden="true">
      <div className="art-topline">
        <span>THE WORLD, IN PERSPECTIVE</span>
        <span className="art-coordinate">DF / 001</span>
      </div>
      <svg className="globe-svg" viewBox="0 0 540 460" fill="none">
        <defs>
          <radialGradient id="planet">
            <stop stopColor="#496448" />
            <stop offset="1" stopColor="#203c30" />
          </radialGradient>
          <linearGradient id="orbit">
            <stop stopColor="#cfdfac" stopOpacity="0" />
            <stop offset=".5" stopColor="#cfdfac" />
            <stop offset="1" stopColor="#cfdfac" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="270"
          cy="225"
          r="162"
          stroke="#b8d2a6"
          strokeOpacity=".12"
        />
        <circle
          cx="270"
          cy="225"
          r="145"
          fill="url(#planet)"
          stroke="#b8d2a6"
          strokeOpacity=".5"
        />
        <g stroke="#c9d8ad" strokeOpacity=".3">
          <ellipse cx="270" cy="225" rx="105" ry="145" />
          <ellipse cx="270" cy="225" rx="53" ry="145" />
          <path d="M270 80v290M125 225h290" />
          <ellipse cx="270" cy="225" rx="145" ry="52" />
          <ellipse cx="270" cy="225" rx="145" ry="102" />
        </g>
        <g fill="#d7e6b2" fillOpacity=".28">
          <path d="m178 132 38-19 32 12-9 22-28 12-6 30-22 4-13-23Zm34 66 30 4 16 36-12 31-15 12-8-33-16-19Zm76-69 29-16 36 15 6 20 30 12-16 24-31-4-9 25-23-4-13-24-29-15Zm17 81 31-2 19 25-16 33-20 17-17-27-13-24Zm57 78 28 2 10 17-22 11-20-12Z" />
        </g>
        <ellipse
          cx="270"
          cy="225"
          rx="236"
          ry="74"
          transform="rotate(-30 270 225)"
          stroke="url(#orbit)"
        />
        <circle cx="401" cy="111" r="6" fill="#e4efc5" />
        <circle cx="401" cy="111" r="13" stroke="#e4efc5" strokeOpacity=".3" />
        <path
          d="M102 60h22m-11-11v22M417 349h18m-9-9v18"
          stroke="#d5e4b2"
          strokeOpacity=".65"
        />
        <text x="115" y="400" fill="#b4c4b1" fontSize="9" letterSpacing="2">
          CONNECTED MARKETS. CONSIDERED DECISIONS.
        </text>
      </svg>
      <div className="floating-note note-one">
        <span className="note-dot" />
        <div>
          <small>THE BIG PICTURE</small>
          <strong>
            Global currencies.
            <br />A clearer perspective.
          </strong>
        </div>
      </div>
      <div className="floating-note note-two">
        <span className="pair-symbol">
          €<span>/</span>$
        </span>
        <div>
          <small>START WITH THE BASICS</small>
          <strong>
            Two currencies.
            <br />
            One exchange rate.
          </strong>
        </div>
      </div>
      <div className="art-bottomline">
        <span>EDUCATION BEFORE EXECUTION</span>
        <span>Illustration · not live market data</span>
      </div>
    </div>
  );
}
