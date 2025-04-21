interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
  const { children, title } = props;

  return (
    <div className="py-4 px-8 md:py-8 md:px-20 mt-14">
      {!!title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      {children}
    </div>
  );
};

export default PageLayout;
