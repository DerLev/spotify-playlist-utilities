import { createStyles, Container, Title, Text, Button, Group, rem } from '@mantine/core'
import ErrorSvg from '@assets/404.svg'
import { Link } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80)
  },

  inner: {
    position: 'relative'
  },

  image: {
    ...theme.fn.cover(),
    opacity: 0.75
  },

  content: {
    paddingTop: rem(220),
    position: 'relative',
    zIndex: 1,

    [theme.fn.smallerThan('sm')]: {
      paddingTop: rem(120),
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    }
  },

  description: {
    maxWidth: rem(540),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`
  },
}))

const ErrorPage = () => {
  const { classes } = useStyles()

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <img src={ErrorSvg} alt="404" className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text color="dimmed" size="lg" align="center" className={classes.description}>
            The page you tried to open does not exists. Click below to return to the home page.
          </Text>
          <Group position="center">
            <Button component={Link} to='/' size="md">Take me back to the home page</Button>
          </Group>
        </div>
      </div>
    </Container>
  )
}

export default ErrorPage
