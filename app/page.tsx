'use client';

import { upload } from '../actions/upload';
import { useState } from 'react';

export default function Home() {
	const [videoUrl, setVideoUrl] = useState<string>(''); // Store video URL
	const [videoId, setVideoId] = useState<string>('');
	const [cloudName] = useState<string>(
		`${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
	);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		const formData = new FormData(event.currentTarget);

		try {
			const result = await upload(formData); // Upload the video
			setVideoUrl(result.originalUrl); // Set the video URL in state
			setVideoId(result.videoId); // Set the video ID for further transformations
		} catch (error) {
			console.error('Upload failed', error);
		} finally {
			setLoading(false); // Stop loading state
		}
	};

	return (
		<div className="min-h-screen flex-col items-center justify-between p-10 mt-14">
			<h1 className="text-3xl text-center pb-5 leading-snug">
				Translate Video Subtitle With <br /> Cloudinary and Azure Video Indexer
			</h1>
			<div className="flex justify-center my-10 items-center ">
				<form onSubmit={handleSubmit} className="border p-2 rounded">
					<input type="file" name="video" accept="video/*" required />
					<button
						type="submit"
						className="bg-blue-800 text-white p-2 rounded-md"
						disabled={loading}
					>
						{loading ? 'Uploading...' : 'Upload'}
					</button>
				</form>
			</div>

			{videoUrl && videoId && (
				<div className="flex justify-center space-x-4 mt-10">
					<div>
						<h2 className="text-lg font-bold text-center mb-4">
							Uploaded Video
						</h2>
						<video
							crossOrigin="anonymous"
							controls
							className="w-full max-w-md border-4 rounded"
						>
							<source id="mp4" src={videoUrl} type="video/mp4" />
						</video>
					</div>
					<div>
						<h2 className="text-lg font-bold text-center mb-4">
							Transformed Video
						</h2>

						<video
							crossOrigin="anonymous"
							controls
							className="w-full max-w-md border-4 rounded"
						>
							<source id="mp4" src={videoUrl} type="video/mp4" />

							<track
								label="English"
								kind="subtitles"
								srcLang="en"
								src={`https://res.cloudinary.com/${cloudName}/raw/upload/${videoId}.en-US.azure.vtt`}
								default
							/>
							<track
								label="Spanish"
								kind="subtitles"
								srcLang="es"
								src={`https://res.cloudinary.com/${cloudName}/raw/upload/${videoId}.es-ES.azure.vtt`}
							/>
						</video>
					</div>
				</div>
			)}
		</div>
	);
}
