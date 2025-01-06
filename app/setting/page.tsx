export const metadata = {
    title: 'Setting Page',
    description: 'This is the settings page.',
};

export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export default function setting() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Setting</h1>
        </div>
    );
}
  