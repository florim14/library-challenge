import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import readData from "./readData"

export default function Home() {
    const [ books, setBooks ] = useState([])
    const [ oldOrder, setOldOrder ] = useState([])
    const [ bookTitle, setBookTitle ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ sortOption, setSortOption ] = useState('relevance')


    /* eslint-disable */
    useEffect(() => {
        const abortController = new AbortController()
        setLoading(true)
        setSortOption('relevance')
        if (bookTitle?.length < 5)
        {
            setLoading(false)
            setOldOrder([])
            setBooks([])
            return
        }
        readData({
            bookTitle: bookTitle,
            localInit: { signal: abortController.signal }
        })
            .then(async response => {
                if (response instanceof DOMException)
                {
                    console.error(response)
                    setOldOrder([])
                    setBooks([])
                }
                else if (response instanceof Response)
                {
                    console.error(await response.json())
                    setOldOrder([])
                    setBooks([])
                }
                else
                {
                    const booksData = response?.docs?.map(book => ({
                        title: book?.title,
                        authors: book?.author_name || [],
                        firstPublishedYear: book?.first_publish_year || 'Unknown',
                        isbn: book?.isbn ? book?.isbn?.[0] : 'Unknown',
                        numPages: book?.number_of_pages ?? book?.number_of_pages_median ?? 'Unknown'
                    }))
                    setOldOrder(booksData)
                    setBooks([ ...booksData ])
                    setLoading(false)
                }
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            })

        return () => abortController.abort()
    }, [ bookTitle ])
    useEffect(() => {
        if (!books.length && loading) return

        if (sortOption === 'relevance')
        {
            setBooks(oldOrder)
        }
        else if (sortOption.startsWith('publishedYear'))
        {
            setBooks([...books].sort((a, b) => {
                if (a.firstPublishedYear === b.firstPublishedYear) return 0
                if (a.firstPublishedYear === 'Unknown') return 1
                if (b.firstPublishedYear === 'Unknown') return -1
                return sortOption === "publishedYearAsc" ? a.firstPublishedYear - b.firstPublishedYear : b.firstPublishedYear - a.firstPublishedYear
            }))
        } 
        else if (sortOption.startsWith('numPages'))
        {
            setBooks([...books].sort((a, b) => {
                if (a.numPages === b.numPages) return 0
                if (a.numPages === 'Unknown') return 1
                if (b.numPages === 'Unknown') return -1
                return sortOption === "numPagesAsc" ? a.numPages - b.numPages : b.numPages - a.numPages
            }))
        }

    }, [ sortOption ])
    /* eslint-disable */

    const handleSearchChange = (event) => {
        setBookTitle(event.target.value)
    }

    const handleSortChange = (event) => {
        setSortOption(event.target.value)
    }

    console.log("Books: ", books)

    return (
        <>
            <Typography variant="h2" component="h3" sx={{textAlign: "center"}}>
                {"Book List"}
            </Typography>

            <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={2}
            >
                <TextField
                    label="Search Book"
                    placeholder="Type at least five letters to search"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    value={bookTitle}
                    onChange={handleSearchChange}
                />

                <Select
                    value={sortOption}
                    disabled={loading || !books.length}
                    onChange={handleSortChange}
                    style={{ marginLeft: '10px' }}
                    label={"Sort Books"}
                    sx={{ width: "50%" }}
                >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="publishedYearAsc">Published Year (ASC)</MenuItem>
                    <MenuItem value="publishedYearDesc">Published Year (DESC)</MenuItem>
                    <MenuItem value="numPagesAsc">Number of Pages (ASC)</MenuItem>
                    <MenuItem value="numPagesDesc">Number of Pages (DESC)</MenuItem>
                </Select>
            </Stack>

            {loading
                ?
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </div>
                 :
                <Grid container spacing={3} mt={2}>
                    {books.map((book, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{
                                    width: '100%',
                                    backgroundColor: '#f0f0f0', // Custom background color
                                    transition: 'transform 0.2s', // Transition effect on hover
                                    '&:hover': {
                                        transform: 'scale(1.05)' // Increase size on hover
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" component="h2">{book.title}</Typography>
                                    <Typography variant="subtitle1" color="text.secondary">Author(s): {book.authors.join(', ')}</Typography>
                                    <Typography variant="body2">First Published Year: {book.firstPublishedYear}</Typography>
                                    <Typography variant="body2">ISBN: {book.isbn}</Typography>
                                    <Typography variant="body2">Number of Pages: {book.numPages}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            }
        </>
    )
}