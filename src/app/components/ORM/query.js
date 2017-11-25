
const query = `
query SiteContent(
  $component:String
  $request:JSON!
  $geo:JSON!
){
  ...RootSiteContent
}

fragment RootSiteContent on RootType{
  siteContent(
    component:$component
    request:$request
    geo:$geo
  ){
    ...SiteContent
  }
}

fragment SiteContent on SiteContentType{
  id
  status
  title
  description
  keywords
  robots
  content
  state
  _errors
  _isDirty
}
`;

export default query;
