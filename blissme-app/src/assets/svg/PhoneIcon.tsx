import React from 'react'

const PhoneIcon: React.FC = () => {
  return (
    <svg
      width="26"
      height="27"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="26" height="27" fill="url(#pattern0_27_27)" />
      <defs>
        <pattern
          id="pattern0_27_27"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_27_27"
            transform="matrix(0.0111111 0 0 0.0106996 0 0.0185185)"
          />
        </pattern>
        <image
          id="image0_27_27"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  )
}

export default PhoneIcon
