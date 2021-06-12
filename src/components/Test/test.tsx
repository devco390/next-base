import { render, screen } from 'utils/test-utils'

import Test from '.'

describe('<Test />', () => {
  it('should render the heading', () => {
    const { container } = render(<Test />)

    expect(screen.getByRole('heading', { name: /Test/i })).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
