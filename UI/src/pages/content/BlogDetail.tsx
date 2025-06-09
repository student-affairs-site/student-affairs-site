import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Banner, Footer, NavBar, TextBox } from '../../components';
import { accent, dark, grey, primary } from '../../context/theme';
import dayjs from 'dayjs';
import { useState } from 'react';

import avatar from '../../assets/svgs/default-user.svg';
import subscribe from '../../assets/svgs/subscribe.svg';
import { BlogItem } from '../../components/Blog';
import subscribeToPushNotifications from '../../subscription';

const BlogDetail = () => {
    const visited = localStorage.getItem('visited') as unknown as boolean;

    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const subscribeUser = async () => {
        try {
            await subscribeToPushNotifications();
            localStorage.setItem('visited', 'true')
            handleClose()
        } catch (e) {
            console.log('An error occured somewhere')
        }
    }

    const location = useLocation();
    const { blog }: { blog: BlogItem } = location.state;

    if (!blog) {
        return <Typography variant="h6">No blog details available.</Typography>;
    }

    const paragraphs = blog?.content?.split('\n');

    return (
        <Stack minHeight={"100vh"} sx={{
            gap: { xs: 6, md: 10, lg: 14 },
            overflowY: "scroll", overflowX: "hidden",
            backgroundColor: grey,
            backgroundSize: "cover",
        }}>
            <NavBar route="Blog" />
            <Box sx={{
                position: "relative",
                width: '100%',
                zIndex: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    transform: 'translate(-50%, 50%)',
                    zIndex: -1,
                    width: "clamp(150px, 50vw, 300px)",
                    aspectRatio: 1,
                    maxWidth: "350px",
                    borderRadius: '50%'
                }
            }}>
                <Banner bannerImage={blog?.image} />
                <TextBox
                    title={blog?.name}
                />
            </Box>

            <Stack pl={3} pr={3} sx={{ flexDirection: "column", gap: { xs: 5, md: 7 } }}>
                <Stack gap={5} direction={'row'} justifyContent={'space-between'} sx={{ zIndex: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        10 minutes read
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {blog?.read_count} views
                    </Typography>
                </Stack>
                <Box sx={{
                    position: "relative",
                    width: '100%',
                    overflowX: 'visible',
                    zIndex: 0,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        transform: 'rotate(135deg) translate(0, -70%)',
                        width: { xs: '50%', lg: '300px', xl: '500px' },
                        aspectRatio: "4/5",
                        borderRadius: '10px',
                        border: `15px ${primary} solid`,
                        opacity: 0.1,
                        zIndex: -1,
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '75%',
                        left: 0,
                        transform: 'rotate(35deg) translate(-70%, 0)',
                        width: { xs: '50%', lg: '300px', xl: '500px' },
                        aspectRatio: "4/5",
                        borderRadius: '10px',
                        border: `15px ${accent} solid`,
                        opacity: 0.2,
                        zIndex: -1,
                    },
                }}>
                    {paragraphs?.map((paragraph, index) => {
                        // Check if the line starts with ## for an <h2> or ### for an <h3>
                        if (paragraph.startsWith('###')) {
                            return (
                                <>
                                    <br />
                                    <Typography
                                        key={index}
                                        variant="h6" // You can change the variant to match the header level
                                        color={dark}
                                        zIndex={1}
                                        textAlign={'left'}
                                        gutterBottom // Adds margin below the header
                                    >
                                        {paragraph.replace('###', '')}
                                    </Typography>
                                </>

                            );
                        } else if (paragraph.startsWith('##')) {
                            return (
                                <>
                                    <br />
                                    <Typography
                                        key={index}
                                        variant="h4" // You can change the variant to match the header level
                                        color={dark}
                                        zIndex={1}
                                        textAlign={'left'}
                                        gutterBottom
                                    >
                                        {paragraph.replace('##', '')}
                                    </Typography>
                                </>

                            );
                        } else {
                            // Regular paragraph text
                            return (
                                <Typography
                                    key={index}
                                    variant="body1"
                                    color={dark}
                                    zIndex={1}
                                    textAlign={'left'}
                                    paragraph // Adds margin below the paragraph
                                >
                                    {paragraph}
                                </Typography>
                            );
                        }
                    })}
                </Box>
                <Stack gap={5} direction={'row'} justifyContent={'space-between'} alignItems={'center'} >
                    <Stack flexWrap={'wrap'} flexGrow={1} gap={1} direction={'row'} alignItems={'inherit'}>
                        <Box
                            component="img"
                            src={avatar}
                            sx={{
                                objectFit: 'contain',
                                backgroundSize: "contain",
                                width: '50px',
                                height: '100%',
                                verticalAlign: 'middle'
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {blog?.author}
                        </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                        Date: {dayjs(blog?.date).format("DD MMM YYYY")}
                    </Typography>
                </Stack>
            </Stack>
            <Footer />

            <Dialog
                open={!visited && open}
                onClose={handleClose}
            >
                <DialogTitle textAlign={'center'} sx={{ marginTop: 1 }}>
                    Stay in the loop! ✨
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="img"
                        src={subscribe}
                        sx={{
                            objectFit: 'cover',
                            backgroundSize: "cover",
                            width: '100%',
                            height: 'auto',
                            loading: 'lazy',
                        }}
                    />

                    <Typography variant="body2" color="text.secondary">
                        Don't miss out on the latest news and updates!
                        Subscribe now and stay up-to-date with everything happening.
                        We’ve got exciting stuff coming your way, and you won’t want to miss a thing!
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ width: '100%', borderColor: 'secondary.main', textTransform: "none", paddingY: 1, fontWeight: 300, mt: 2 }}
                        onClick={async () => await subscribeUser()}
                    >
                        Subscribe
                    </Button>
                </DialogContent>
            </Dialog>
        </Stack>
    );
};

export default BlogDetail;
