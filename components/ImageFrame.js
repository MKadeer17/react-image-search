import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: "RrdWVhsDrCfLaXDFcFtRvE7wXHDgQZWBBykIXbb3Pn4"
})

export default function ImageFrame() {
    const [imageName, setImageName] = useState('Work');
    const [searchImage, setSearchImage] = useState('');
    const [imageLoadError, setImageLoadError] = useState('');
    const [imageList, setImageList] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, imagePerPage: 6});

    const indexOfLastPage = pagination.currentPage * pagination.imagePerPage;
    const indexOfFirstPage = indexOfLastPage - pagination.imagePerPage;
    const currentImages = imageList?.slice(indexOfFirstPage, indexOfLastPage);

    
    useEffect(() => {
        unsplash.search.getCollections({
            query: searchImage,
            perPage:50,
        }).then((res) => setImageList(res.response?.results))
        .catch((err) => setImageLoadError(err))
    }, [searchImage]);

    // setPage Limit 5 
    const getPageNumberGroup = () => {
        let start = Math.floor((pagination.currentPage - 1) / 5) * 5;
        return new Array(5).fill().map((_, index) => start + index + 1)
    }
    
    return (
        <Container>
            <Title>React Image Search</Title>
            <SearchContainer>
                <SearchInput
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    type='text' 
                    placeholder='Search Image Like: Computer, Tour, Work'
                />
                <SearchButton 
                    
                    type='button' 
                    onClick={(e) => {
                        e.preventDefault();
                        setSearchImage(imageName)
                        }}
                >
                    Search
                </SearchButton>
            </SearchContainer>
            {
                imageList?.length ? (
                    <ImageGridFrame>
                    {   currentImages.map(({id, preview_photos, cover_photo })=> (
                            <img loading="lazy" key={id} src={preview_photos?.[0]?.urls?.small} alt={cover_photo?.alt_description} />
                        )) 
                    }
                </ImageGridFrame>
                ) : imageName ? <h5>{imageLoadError}</h5> : <h5>Please Provide Image Name</h5>
            }
            
            <PaginationGroup>
                <ol>
                    {   
                        imageList?.length ? getPageNumberGroup().map((pageNumber) => (
                            <li key={pageNumber} 
                                id={pageNumber}
                                onClick={(e) => setPagination({...pagination, currentPage: Number(e.target.id)})}
                            >
                                {pageNumber}
                            </li>
                        ))  
                        : ''
                    }
                </ol>
            </PaginationGroup>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Title = styled.h1`
    text-decoration: underline;
`;

const SearchContainer = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SearchInput = styled.input`
    padding: 15px;
    width: 350px;
    border: none;
    border-radius: 5px;
    outline-color: cornflowerblue;
`;

const SearchButton = styled.button`
    margin: 10px;
    padding: 15px;
    border: none;
    border-radius: 5px;
    background-color: white;
    transition: background-color ease-in 0.2s;
    cursor: pointer;

    &:hover {
        background-color: cornflowerblue;
    }
`;

const ImageGridFrame = styled.div`
    margin: 15px;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    border: 1px solid #252525;
    border-radius: 5px;
    gap: 10px;
    place-items: center;
`;

const PaginationGroup = styled.div`
    margin-right: 200px;
    align-self: flex-end;
`;
