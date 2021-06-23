import { render, screen } from 'utils/test-utils'

import UserList from '.'

describe('<UserList />', () => {
  it('should render the heading', () => {
    const { container } = render(<UserList />)

    expect(
      screen.getByRole('heading', { name: /UserList/i })
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
