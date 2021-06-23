import { render, screen } from 'utils/test-utils'

import Image from '.'

const imageUrl = '/img/logo_ml.png'

describe('<Image />', () => {
  it('should render the image', async () => {
    render(<Image src={imageUrl} width={192} height={182} quality={25} />)

    const image = screen.getByTestId('next-image')

    expect(await image).toBeInTheDocument()
  })
})
