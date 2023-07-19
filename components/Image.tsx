// import NextImage from 'next/image'
// import PlaceholderImg from 'constants/empty'
import { ImageProps } from 'next/image';
import { EmptyImg } from 'constants/empty';

interface Props extends Omit<ImageProps, 'src'> {
  src?: string | null;
}
const Image = ({
  layout,
  width,
  height,
  src,
  objectFit,
  alt,
  ...props
}: Props) => {
  return (
    <img
      {...props}
      src={src || EmptyImg}
      css={{
        width: layout === 'fill' ? '100%' : width,
        height: layout === 'fill' ? '100%' : height,
        objectFit: objectFit || 'cover',
      }}
      alt={alt}
    />
  );
  // return (
  //   <NextImage
  //     {...props}
  //     src={src}
  //     blurDataURL={PlaceholderImg}
  //     placeholder="blur"
  //     quality={80}
  //     css={{
  //       overflow: 'hidden',
  //     }}
  //   />
  // );
};
export default Image;
