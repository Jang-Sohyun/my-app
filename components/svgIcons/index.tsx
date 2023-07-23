import SvgIcon from '@mui/material/SvgIcon';
import theme from '../../constants/theme';

export const AppleIcon = (props: any) => (
  <SvgIcon
    width="14"
    height="16"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5118 5.36657C12.6299 4.53859 11.8662 3.7336 10.2441 3.64927C8.93703 3.59561 8.3386 4.36992 7.11813 4.39292C5.9764 4.43125 6.06301 3.54194 3.70081 3.79494C1.65356 4.01726 -0.133838 6.01055 0.00789452 8.80116C0.149627 11.8218 2.30711 16 4.33073 16C5.75593 15.9693 6.09451 15.31 7.25986 15.31C8.70868 15.31 9.04726 16.138 10.189 15.977C12.1496 15.701 14 12.6804 14 11.7144C12.9213 11.1624 11.8425 10.2195 11.7008 8.64016C11.5827 7.06086 12.5748 6.06422 13.5118 5.36657Z"
      fill="white"
    />
    <path
      d="M6.71661 3.87159C6.57488 2.76761 7.34653 0.360326 10.0473 0C10.3544 1.85529 8.79535 3.98658 6.71661 3.87159Z"
      fill="white"
    />
  </SvgIcon>
);
export const KakaoIcon = ({ ...props }) => (
  <SvgIcon viewBox="0 0 24 24" role="img" {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0H24V24H0z" />
      <rect width="20" height="20" x="2" y="2" fill="#FAE300" rx="2" />
      <path
        fill="#391B1B"
        d="M12 7c-3.314 0-6 2.124-6 4.743 0 1.705 1.138 3.2 2.846 4.036-.125.468-.454 1.697-.52 1.96-.081.327.12.322.251.234.103-.068 1.644-1.116 2.31-1.568.36.053.732.082 1.113.082 3.314 0 6-2.124 6-4.744C18 9.123 15.314 7 12 7"
      />
    </g>
  </SvgIcon>
);

export function LikeIcon({ style, isLiked, ...props }: any) {
  return (
    <SvgIcon
      {...props}
      style={{
        fill: isLiked ? theme.palette.secondary.main : 'none',
        stroke: isLiked ? theme.palette.secondary.main : '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="20.94"
      height="19.573"
      viewBox="0 0 20.94 19.573"
    >
      <path
        d="M9.72 18.073A.487.487 0 0 1 9.471 18a28.212 28.212 0 0 1-4.7-3.557 18.715 18.715 0 0 1-3.257-3.912A9.6 9.6 0 0 1 0 5.581 5.485 5.485 0 0 1 5.371 0a5.047 5.047 0 0 1 3 1.1A5.758 5.758 0 0 1 9.72 2.544 5.758 5.758 0 0 1 11.069 1.1a5.047 5.047 0 0 1 3-1.1 5.485 5.485 0 0 1 5.371 5.581 9.611 9.611 0 0 1-1.516 4.954 18.708 18.708 0 0 1-3.256 3.912A28.212 28.212 0 0 1 9.969 18a.487.487 0 0 1-.249.068z"
        transform="translate(.75 .75)"
        // style="fill:none;stroke:#414141;stroke-miterlimit:10;stroke-width:1.5px"
      />
    </SvgIcon>
  );
}
export function SearchIcon({ style, isLiked, ...props }: any) {
  return (
    <SvgIcon
      {...props}
      style={{
        fill: isLiked ? theme.palette.secondary.main : 'none',
        stroke: isLiked ? theme.palette.secondary.main : '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="25"
      height="25"
      viewBox="0 0 25 25"
    >
      <g data-name="vuesax/broken/search-normal">
        <path
          d="M9.5 0a9.5 9.5 0 1 1-4.3 1.03"
          transform="translate(2.5 2.5)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
        <path
          data-name="Vector"
          d="M2 2 0 0"
          transform="translate(20.5 20.5)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
      </g>
    </SvgIcon>
  );
}

export function WriteIcon({ style, ...props }: any) {
  return (
    <SvgIcon
      style={{
        fill: 'none',
        stroke: '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="49"
      height="49"
      viewBox="0 0 49 49"
      {...props}
    >
      <g data-name="vuesax/broken/brush">
        <path
          d="M0 0v4.034c0 9.792 3.917 13.708 13.708 13.708h11.75c9.792 0 13.708-3.917 13.708-13.708V.118"
          transform="translate(4.859 26.341)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0 0;fill:none;stroke:#414141;stroke-width:2px"
        />
        <path
          data-name="Vector"
          d="M17.625 0h-3.917C3.917 0 0 3.917 0 13.708"
          transform="translate(4.859 4.917)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0 0;fill:none;stroke:#414141;stroke-width:2px"
        />
        <path
          data-name="Vector"
          d="M17.743 1.959a32 32 0 0 1 3.721-1.8 2.217 2.217 0 0 1 2.389.49 2.191 2.191 0 0 1 .509 2.409 52.866 52.866 0 0 1-13.513 18.249l-3.094 2.468a5.156 5.156 0 0 1-1.234.7 7.189 7.189 0 0 0-.059-.9A6.087 6.087 0 0 0 4.641 20a6.389 6.389 0 0 0-3.7-1.86 7.532 7.532 0 0 0-.94-.02 3.986 3.986 0 0 1 .763-1.32l2.448-3.094A47.49 47.49 0 0 1 12 5.66"
          transform="translate(19.505 4.916)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0 0;fill:none;stroke:#414141;stroke-width:2px"
        />
        <path
          data-name="Vector"
          d="M11.34 10.994a6.446 6.446 0 0 1-3.8 1.821l-3.858.411A3.328 3.328 0 0 1 .021 9.545l.411-3.858A6.37 6.37 0 0 1 6.718.008a7.532 7.532 0 0 1 .94.02 6.389 6.389 0 0 1 3.7 1.86 6.142 6.142 0 0 1 1.821 3.584 7.433 7.433 0 0 1 .059.9 6.553 6.553 0 0 1-1.898 4.622z"
          transform="translate(12.788 23.004)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0 0;fill:none;stroke:#414141;stroke-width:2px"
        />
        <path
          data-name="Vector"
          d="M7.422 7.422A7.417 7.417 0 0 0 0 0"
          transform="translate(24.557 17.039)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:0 0;fill:none;stroke:#414141;stroke-width:2px"
        />
      </g>
    </SvgIcon>
  );
}

export function ShareIcon({ style, ...props }: any) {
  return (
    <SvgIcon
      style={{
        fill: 'none',
        stroke: '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="17.187"
      height="20.353"
      viewBox="0 0 17.187 20.353"
      {...props}
    >
      <path
        d="M486.718 660.44v8.847a3.9 3.9 0 0 1-3.774 4.006h-8.338a3.9 3.9 0 0 1-3.774-4.006v-8.847"
        transform="translate(-470.181 -653.59)"
        // style="fill:none;stroke:#414141;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3px"
      />
      <g>
        <path
          // data-name="path"
          d="M478.749 662.1v-9.985l-4.253 3.225"
          transform="translate(-470.346 -651.208)"
          // style="fill:none;stroke:#414141;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3px"
        />
        <path
          transform="translate(8.403 .909)"
          d="m0 0 3.688 2.706"
          // style="fill:none;stroke:#414141;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3px"
        />
      </g>
    </SvgIcon>
  );
}

export function MessageIcon({ style, ...props }: any) {
  return (
    <SvgIcon
      style={{
        fill: 'none',
        stroke: '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      {...props}
    >
      <g>
        <path
          d="M17 7.92v1.43a4.225 4.225 0 0 1-1.17 3.08 4.225 4.225 0 0 1-3.08 1.17v1.81a.849.849 0 0 1-1.32.71l-.97-.64a3.629 3.629 0 0 0 .13-1.01V10.4A3.212 3.212 0 0 0 7.19 7H.4c-.14 0-.27.01-.4.02V4.25A4.015 4.015 0 0 1 4.25 0h8.5A4.015 4.015 0 0 1 17 4.25"
          transform="translate(5.5 2.5)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
        <path
          d="M0 3.4A3.183 3.183 0 0 1 3 .02c.13-.01.26-.02.4-.02h6.79a3.212 3.212 0 0 1 3.4 3.4v4.07a3.629 3.629 0 0 1-.13 1.01 3.155 3.155 0 0 1-3.27 2.39H7.47l-3.02 2.01a.671.671 0 0 1-1.05-.56v-1.45a3.4 3.4 0 0 1-2.46-.93A3.4 3.4 0 0 1 0 7.47"
          transform="translate(2.5 9.5)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
      </g>
    </SvgIcon>
  );
}

export function NotiIcon({ style, ...props }: any) {
  return (
    <SvgIcon
      style={{
        fill: 'none',
        stroke: '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <g>
        <path
          d="M14.046 8.89V6a6 6 0 0 0-12 0v2.89a4.778 4.778 0 0 1-.57 2.06l-1.15 1.91a1.919 1.919 0 0 0 1.08 2.93 20.921 20.921 0 0 0 13.27 0 2 2 0 0 0 1.08-2.93"
          transform="translate(3.975 2.91)"
          // style="stroke-linecap:round;stroke:#414141;stroke-miterlimit:10;stroke-width:1.5px;stroke-dasharray:0 0;fill:none"
        />
        <path
          d="M6 0a3.009 3.009 0 0 1-3 3 3.011 3.011 0 0 1-2.12-.88A3.011 3.011 0 0 1 0 0"
          transform="translate(9.02 19.06)"
          // style="stroke:#414141;stroke-miterlimit:10;stroke-width:1.5px;stroke-dasharray:0 0;fill:none"
        />
      </g>
    </SvgIcon>
  );
}

export function PhotoIcon({ style, ...props }: any) {
  return (
    <SvgIcon
      style={{
        fill: 'none',
        stroke: '#A3A3A3',
        strokeMiterlimit: 10,
        strokeWidth: '1.5px',
        ...style,
      }}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      {...props}
    >
      <g data-name="vuesax/broken/gallery">
        <path
          d="M0 10.99V13c0 5 2 7 7 7h6c5 0 7-2 7-7V7c0-5-2-7-7-7H7C2 0 0 2 0 7"
          transform="translate(2.5 2.5)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
        <path
          data-name="Vector"
          d="M4 2a2 2 0 1 1-2-2"
          transform="translate(7.5 6.5)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
        <path
          data-name="Vector"
          d="m0 6.953 4.93-3.31a2.253 2.253 0 0 1 2.64.14l.33.29a2.229 2.229 0 0 0 2.82 0L14.88.5a2.229 2.229 0 0 1 2.82 0l1.63 1.4"
          transform="translate(3.17 12.498)"
          // style="stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;stroke-dasharray:0 0;fill:none;stroke:#414141"
        />
      </g>
    </SvgIcon>
  );
}
