<?php
/**
 * Created by PhpStorm.
 * User: vahav
 * Date: 12/04/2018
 * Time: 20:03
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Ordering;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class VisitController extends Controller
{
    public function indexAction(){

        $em = $this->getDoctrine()->getManager();

        $data = $em->createQueryBuilder()
            ->select('visits.id, DATE_FORMAT( visits.date, \'%Y-%M-%d %H:%i:%s\' )as date, visits.ip')
            ->from('AppBundle:Visit','visits')
            ->getQuery()
            ->getArrayResult();

        $data = json_encode($data);

        return $this->render('/visit/index.html.twig',[
            'data'=>$data,
        ]);
    }

}