// resources/js/Layouts/AuthenticatedLayout.jsx

const AuthenticatedLayout = ({ children }) => {
    return (
        <div>
            <header>Header content</header>
            <main>{children}</main>
        </div>
    );
};

export default AuthenticatedLayout; // これが必要
