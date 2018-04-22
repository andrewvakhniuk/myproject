<?php
/**
 * Created by PhpStorm.
 * User: vahav
 * Date: 07/04/2018
 * Time: 23:25
 */

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

class User extends BaseUser
{
    protected $id;

    public function __construct()
    {
        parent::__construct();
        // your own logic
    }
}
